import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import {
  Rfi,
  CreateRfiDto,
  UpdateRfiDto,
  RfiStatus,
} from '@/types/rfi.types';
import { FilterOptions } from '@/types/common.type';

interface RfiStats {
  total: number;
  draft: number;
  published: number;
  closed: number;
}

interface RfiStore {
  rfis: Rfi[];
  filteredRfis: Rfi[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: RfiStats;
  fetchRfis: () => Promise<void>;
  addRfi: (rfi: CreateRfiDto) => Promise<void>;
  updateRfi: (id: string, rfi: UpdateRfiDto) => Promise<void>;
  deleteRfi: (id: string) => Promise<void>;
  bulkDeleteRfis: (ids: string[]) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useRfiStore = create<RfiStore>((set, get) => ({
  rfis: [],
  filteredRfis: [],
  isLoading: false,
  filters: {},
  stats: { total: 0, draft: 0, published: 0, closed: 0 },

  // -----------------------------
  // Fetch all RFIs
  // -----------------------------
  fetchRfis: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/rfis');
      set({ rfis: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching RFIs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------------
  // Add new RFI
  // -----------------------------
  addRfi: async (rfiData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/rfis', rfiData);
      set({ rfis: [...get().rfis, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding RFI:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------------
  // Update RFI
  // -----------------------------
  updateRfi: async (id, rfiData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/rfis/${id}`, rfiData);
      const updated = get().rfis.map((r) => (r.id === id ? res.data : r));
      set({ rfis: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating RFI:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------------
  // Delete single RFI
  // -----------------------------
  deleteRfi: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/rfis/${id}`);
      set({ rfis: get().rfis.filter((r) => r.id !== id) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting RFI:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------------
  // Bulk Delete
  // -----------------------------
  bulkDeleteRfis: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/rfis/bulk-delete', { ids });
      set({ rfis: get().rfis.filter((r) => !ids.includes(r.id)) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting RFIs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------------
  // Filtering and Stats
  // -----------------------------
  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },

  applyFilters: () => {
    const { rfis, filters } = get();
    let filtered = [...rfis];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.referenceNumber.toLowerCase().includes(term) ||
          r.title.toLowerCase().includes(term)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    set({ filteredRfis: filtered });
  },

  calculateStats: () => {
    const { rfis } = get();
    const total = rfis.length;
    const draft = rfis.filter((r) => r.status === RfiStatus.DRAFT).length;
    const published = rfis.filter((r) => r.status === RfiStatus.PUBLISHED).length;
    const closed = rfis.filter((r) => r.status === RfiStatus.CLOSED).length;

    set({ stats: { total, draft, published, closed } });
  },
}));
