import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import {
  Planning,
  PlanningStatus,
  CreatePlanningDto,
  UpdatePlanningDto,
  ApprovePlanningDto,
} from '@/types/planning.type';
import { FilterOptions } from '@/types/common.type';

interface PlanningStats {
  total: number;
  draft: number;
  requested: number;
  approved: number;
  rejected: number;
}

interface PlanningStore {
  plannings: Planning[];
  filteredPlannings: Planning[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: PlanningStats;

  fetchPlannings: () => Promise<void>;
  addPlanning: (dto: CreatePlanningDto) => Promise<void>;
  updatePlanning: (id: string, dto: UpdatePlanningDto) => Promise<void>;
  deletePlanning: (id: string) => Promise<void>;
  requestApproval: (id: string) => Promise<void>;
  approvePlanning: (id: string, dto: ApprovePlanningDto) => Promise<void>;

  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const usePlanningStore = create<PlanningStore>((set, get) => ({
  plannings: [],
  filteredPlannings: [],
  isLoading: false,
  filters: {},
  stats: {
    total: 0,
    draft: 0,
    requested: 0,
    approved: 0,
    rejected: 0,
  },

  fetchPlannings: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/planning');
      set({ plannings: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching plannings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPlanning: async (dto) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/planning', dto);
      set({ plannings: [...get().plannings, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding planning:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlanning: async (id, dto) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/planning/${id}`, dto);
      const updated = get().plannings.map(p => p.id === id ? res.data : p);
      set({ plannings: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating planning:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlanning: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/planning/${id}`);
      set({ plannings: get().plannings.filter(p => p.id !== id) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting planning:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  requestApproval: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/planning/${id}/request-approval`);
      const updated = get().plannings.map(p => p.id === id ? res.data : p);
      set({ plannings: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error requesting approval:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  approvePlanning: async (id, dto) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/planning/${id}/approve`, dto);
      const updated = get().plannings.map(p => p.id === id ? res.data : p);
      set({ plannings: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error approving planning:', error);
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
    const { plannings, filters } = get();
    let filtered = [...plannings];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    set({ filteredPlannings: filtered });
  },

  calculateStats: () => {
    const { plannings } = get();
    const total = plannings.length;
    const draft = plannings.filter(p => p.status === PlanningStatus.DRAFT).length;
    const requested = plannings.filter(p => p.status === PlanningStatus.REQUESTED).length;
    const approved = plannings.filter(p => p.status === PlanningStatus.APPROVED).length;
    const rejected = plannings.filter(p => p.status === PlanningStatus.REJECTED).length;

    set({ stats: { total, draft, requested, approved, rejected } });
  }
}));
