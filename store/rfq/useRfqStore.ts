import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { RFQ, RFQStatus, CreateRFQDto } from '@/types/rfq.types';
import { FilterOptions } from '@/types/common.type';

interface RfqStats {
  total: number;
  totalAmount: number;
  draft: number;
  awarded: number;
  closed: number;
}

interface RfqStore {
  rfqs: RFQ[];
  filteredRfqs: RFQ[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: RfqStats;
  fetchRfqs: () => Promise<void>;
  addRfq: (rfq: CreateRFQDto) => Promise<void>;
  updateRfq: (id: string, rfq: CreateRFQDto) => Promise<void>;
  deleteRfq: (id: string) => Promise<void>;
  bulkDeleteRfqs: (ids: string[]) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useRfqStore = create<RfqStore>((set, get) => ({
  rfqs: [],
  filteredRfqs: [],
  isLoading: false,
  filters: {},
  stats: {
    total: 0,
    totalAmount: 0,
    draft: 0,
    awarded: 0,
    closed: 0,
  },

  fetchRfqs: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/rfqs');
      set({ rfqs: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addRfq: async (rfqData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/rfqs', rfqData);
      set({ rfqs: [...get().rfqs, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding RFQ:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateRfq: async (id, rfqData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/rfqs/${id}`, rfqData);
      const updatedRfqs = get().rfqs.map(r =>
        r.id === id ? res.data : r
      );
      set({ rfqs: updatedRfqs });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating RFQ:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRfq: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/rfqs/${id}`);
      set({ rfqs: get().rfqs.filter(r => r.id !== id) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting RFQ:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeleteRfqs: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/rfqs/bulk-delete', { ids });
      set({
        rfqs: get().rfqs.filter(r => !ids.includes(r.id))
      });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting RFQs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },

  applyFilters: () => {
    const { rfqs, filters } = get();
    let filtered = [...rfqs];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.rfqNumber.toLowerCase().includes(searchTerm) ||
        r.supplier.name.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status as RFQStatus);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(r => new Date(r.issuedDate || '') >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(r => new Date(r.validUntil || '') <= new Date(filters.dateTo!));
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof RFQ];
        const bValue = b[filters.sortBy as keyof RFQ];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'desc'
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'desc'
            ? bValue - aValue
            : aValue - bValue;
        }

        return 0;
      });
    }

    set({ filteredRfqs: filtered });
  },

  calculateStats: () => {
    const { rfqs } = get();
    const total = rfqs.length;
    const totalAmount = rfqs.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const draft = rfqs.filter(r => r.status === 'draft').length;
    const awarded = rfqs.filter(r => r.status === 'awarded').length;
    const closed = rfqs.filter(r => r.status === 'closed').length;

    set({
      stats: {
        total,
        totalAmount,
        draft,
        awarded,
        closed
      }
    });
  },
}));
