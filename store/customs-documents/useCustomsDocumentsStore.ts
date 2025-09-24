import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import {
  CustomsDocument,
  CustomsDocumentFilterOptions,
  CreateCustomsDocumentForm,
} from '@/types/shipment.types';

interface CustomsDocumentsState {
  customsDocuments: CustomsDocument[];
  filteredDocuments: CustomsDocument[];
  isLoading: boolean;
  filters: Partial<CustomsDocumentFilterOptions>;
  stats: {
    totalDocuments: number;
    pendingApproval: number;
    approved: number;
    expiringSoon: number;
  };
  fetchCustomsDocuments: () => Promise<void>;
  setFilters: (filters: Partial<CustomsDocumentFilterOptions>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  createCustomsDocument: (payload: CreateCustomsDocumentForm) => Promise<void>;
  updateCustomsDocument: (id: string, payload: CreateCustomsDocumentForm) => Promise<void>;
  deleteCustomsDocument: (id: string) => Promise<void>;
  bulkDeleteDocuments: (ids: string[]) => Promise<void>;
  // workflow
  reviewCustomsDocument: (id: string, reviewerId: string, notes: string) => Promise<void>;
  approveCustomsDocument: (id: string, approverId: string, notes?: string) => Promise<void>;
  rejectCustomsDocument: (id: string, approverId: string, reason: string) => Promise<void>;
  submitForApproval: (id: string) => Promise<void>;
}

export const useCustomsDocumentsStore = create<CustomsDocumentsState>((set, get) => ({
  customsDocuments: [],
  filteredDocuments: [],
  isLoading: false,
  filters: {},
  stats: {
    totalDocuments: 0,
    pendingApproval: 0,
    approved: 0,
    expiringSoon: 0,
  },
  fetchCustomsDocuments: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get<CustomsDocument[]>('/customs-documents');
      const stats = {
        totalDocuments: data.length,
        pendingApproval: data.filter((d) => d.status === 'pending_approval').length,
        approved: data.filter((d) => d.status === 'approved').length,
        expiringSoon: data.filter((d) => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)).length,
      };
      set({ customsDocuments: data, filteredDocuments: data, stats });
    } finally {
      set({ isLoading: false });
    }
  },
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {}, filteredDocuments: get().customsDocuments }),
  applyFilters: () => {
    const { filters, customsDocuments } = get();
    const filtered = customsDocuments.filter((d) => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        if (!(
          d.documentNumber.toLowerCase().includes(term) ||
          d.issuingAuthority.toLowerCase().includes(term) ||
          d.issuingCountry.toLowerCase().includes(term)
        )) return false;
      }
      if (filters.type && d.type !== filters.type) return false;
      if (filters.status && d.status !== filters.status) return false;
      if (
        typeof filters.requiresApproval === 'boolean' &&
        d.requiresApproval !== filters.requiresApproval
      ) return false;
      if (filters.issuingAuthority && d.issuingAuthority !== filters.issuingAuthority) return false;
      if (filters.issuingCountry && d.issuingCountry !== filters.issuingCountry) return false;
      if (filters.dateFrom && d.issuedDate < filters.dateFrom) return false;
      if (filters.dateTo && d.issuedDate > filters.dateTo) return false;
      return true;
    });
    // sort
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'asc';
    filtered.sort((a: any, b: any) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (sortOrder === 'asc' ? 1 : -1);
    });
    set({ filteredDocuments: filtered });
  },
  createCustomsDocument: async (payload) => {
    await axiosInstance.post('/customs-documents', payload);
    await get().fetchCustomsDocuments();
  },
  updateCustomsDocument: async (id, payload) => {
    await axiosInstance.put(`/customs-documents/${id}`, payload);
    await get().fetchCustomsDocuments();
  },
  deleteCustomsDocument: async (id) => {
    await axiosInstance.delete(`/customs-documents/${id}`);
    await get().fetchCustomsDocuments();
  },
  bulkDeleteDocuments: async (ids) => {
    await axiosInstance.post(`/customs-documents/bulk-delete`, { ids });
    await get().fetchCustomsDocuments();
  },
  reviewCustomsDocument: async (id, reviewerId, notes) => {
    await axiosInstance.post(`/customs-documents/${id}/review`, { reviewerId, notes });
    await get().fetchCustomsDocuments();
  },
  approveCustomsDocument: async (id, approverId, notes) => {
    await axiosInstance.post(`/customs-documents/${id}/approve`, { approverId, notes });
    await get().fetchCustomsDocuments();
  },
  rejectCustomsDocument: async (id, approverId, reason) => {
    await axiosInstance.post(`/customs-documents/${id}/reject`, { approverId, reason });
    await get().fetchCustomsDocuments();
  },
  submitForApproval: async (id) => {
    await axiosInstance.post(`/customs-documents/${id}/submit`);
    await get().fetchCustomsDocuments();
  },
}));


