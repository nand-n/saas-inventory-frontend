// @/stores/grn.store.ts
import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { GoodsReceipt, GoodsReceiptStatus, CreateGoodsReceiptDto, UpdateGoodsReceiptDto } from '@/types/grn.types';
import { FilterOptions } from '@/types/common.type';

interface GRNStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface GRNStore {
  grns: GoodsReceipt[];
  filteredGrns: GoodsReceipt[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: GRNStats;
  fetchGrns: () => Promise<void>;
  addGrn: (grn: CreateGoodsReceiptDto) => Promise<void>;
  updateGrn: (id: string, grn: UpdateGoodsReceiptDto) => Promise<void>;
  deleteGrn: (id: string) => Promise<void>;
  bulkDeleteGrns: (ids: string[]) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useGrnStore = create<GRNStore>((set, get) => ({
  grns: [],
  filteredGrns: [],
  isLoading: false,
  filters: {},
  stats: { total: 0, pending: 0, approved: 0, rejected: 0 },

  fetchGrns: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/goods-receipts');
      set({ grns: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching GRNs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addGrn: async (grnData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/goods-receipts', grnData);
      set({ grns: [...get().grns, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding GRN:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateGrn: async (id, grnData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/goods-receipts/${id}`, grnData);
      const updated = get().grns.map(g => g.id === id ? res.data : g);
      set({ grns: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating GRN:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGrn: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/goods-receipts/${id}`);
      set({ grns: get().grns.filter(g => g.id !== id) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting GRN:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeleteGrns: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/goods-receipts/bulk-delete', { ids });
      set({ grns: get().grns.filter(g => !ids.includes(g.id)) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting GRNs:', error);
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
    const { grns, filters } = get();
    let filtered = [...grns];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(g =>
        g.grnNumber.toLowerCase().includes(term) ||
        g.receivedBy?.toLowerCase().includes(term)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status);
    }

    set({ filteredGrns: filtered });
  },

  calculateStats: () => {
    const { grns } = get();
    const total = grns.length;
    const pending = grns.filter(g => g.status === GoodsReceiptStatus.PENDING).length;
    const approved = grns.filter(g => g.status === GoodsReceiptStatus.APPROVED).length;
    const rejected = grns.filter(g => g.status === GoodsReceiptStatus.REJECTED).length;

    set({ stats: { total, pending, approved, rejected } });
  },
}));
