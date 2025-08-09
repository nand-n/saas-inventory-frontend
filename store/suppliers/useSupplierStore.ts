import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { Supplier, SupplierFilterOptions } from '@/types/supplier.types';

interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
}

interface SupplierStore {
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  isLoading: boolean;
  filters: SupplierFilterOptions;
  stats: SupplierStats;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Partial<Supplier>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  bulkDeleteSuppliers: (ids: string[]) => Promise<void>;
  setFilters: (filters: SupplierFilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  filteredSuppliers: [],
  isLoading: false,
  filters: {},
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
  },

  fetchSuppliers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/suppliers');
      set({ suppliers: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addSupplier: async (supplierData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/suppliers', supplierData);
      const { suppliers } = get();
      const updatedSuppliers = [...suppliers, res.data];
      set({ suppliers: updatedSuppliers });
      get().applyFilters();
      get().fetchSuppliers()
      get().calculateStats();
    } catch (error) {
      console.error('Error adding supplier:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSupplier: async (id, supplierData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/suppliers/${id}`, supplierData);
      const { suppliers } = get();
      const updatedSuppliers = suppliers.map(s =>
        s.id === id ? res.data : s
      );
      set({ suppliers: updatedSuppliers });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating supplier:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSupplier: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/suppliers/${id}`);
      const { suppliers } = get();
      const updatedSuppliers = suppliers.filter(s => s.id !== id);
      set({ suppliers: updatedSuppliers });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeleteSuppliers: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/suppliers/bulk-delete', { ids });
      const { suppliers } = get();
      const updatedSuppliers = suppliers.filter(s => !ids.includes(s.id));
      set({ suppliers: updatedSuppliers });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting suppliers:', error);
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
    const { suppliers, filters } = get();
    let filtered = [...suppliers];

    // Example search: by name, code, contact person, or email
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.code.toLowerCase().includes(searchTerm) ||
        s.contactPerson.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    if (filters.country) {
      filtered = filtered.filter(s => s.address?.country === filters.country);
    }

    if (filters.city) {
      filtered = filtered.filter(s => s.address?.city === filters.city);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(s => s.createdAt && s.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(s => s.createdAt && s.createdAt <= filters.dateTo!);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Supplier];
        const bValue = b[filters.sortBy as keyof Supplier];

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

    set({ filteredSuppliers: filtered });
  },

  calculateStats: () => {
    const { suppliers } = get();
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'active').length;
    const inactive = suppliers.filter(s => s.status === 'inactive').length;

    set({
      stats: {
        total,
        active,
        inactive,
      },
    });
  },
}));
