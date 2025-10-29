import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { Department, DepartmentFormData } from "@/types/department.types";
import { User } from "@/types/user.types";
import { Branch } from "@/types/branchTypes.type";
import { toast } from "@/hooks/use-toast";

interface Filters {
  search: string;
  isActive?: boolean;
  branchId: string;
  managerId: string;
  parentDepartmentId: string;
}

interface DepartmentState {
  branches: Branch[];
  users: User[];
  departments: Department[];
  filteredDepartments: Department[];
  selectedDepartments: string[];
  selectedDepartment: Department | null;
  loading: boolean;
  expanded: string | null;
  filters: Filters;
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalBudget: number;
    averageBudget: number;
  };

  // Actions
  fetchAll: (tenantId: string) => Promise<void>;
  fetchBranches: (tenantId: string) => Promise<void>;
  fetchUsers: (tenantId: string) => Promise<void>;
  fetchDepartments: (tenantId: string) => Promise<void>;

  addDepartment: (tenantId: string, data: DepartmentFormData) => Promise<void>;
  editDepatment: (tenantId: string, id: string, data: DepartmentFormData) => Promise<void>;
deleteDepartment: (tenantId: string, id: string) => Promise<void>;
  bulkDelete: (tenantId: string, ids: string[]) => Promise<void>;

  setFilters: (filters: Partial<Filters>) => void;
  applyFilters: () => void;
  getManagerName: (managerId: string) => string;
  getBranchName: (branchId: string) => string;
  handleToggle: (id: string) => void;
  setSelectedDepartment: (dep: Department | null) => void;
  setSelectedDepartments: (ids: string[]) => void;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  branches: [],
  users: [],
  departments: [],
  filteredDepartments: [],
  selectedDepartments: [],
  selectedDepartment: null,
  loading: false,
  expanded: null,
  filters: {
    search: "",
    isActive: undefined,
    branchId: "",
    managerId: "",
    parentDepartmentId: "",
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    totalBudget: 0,
    averageBudget: 0,
  },

  // ─── Fetch Data ────────────────────────────────
  fetchAll: async (tenantId) => {
    await Promise.all([
      get().fetchBranches(tenantId),
      get().fetchUsers(tenantId),
      get().fetchDepartments(tenantId),
    ]);
  },

  fetchBranches: async (tenantId) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<Branch[]>(`/branches/${tenantId}`);
      set({ branches: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async (tenantId) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<User[]>(`/users/tenant/${tenantId}`);
      set({ users: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchDepartments: async (tenantId) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<Department[]>(`/departments/tenant/${tenantId}`);
      set({ departments: data, filteredDepartments: data });
    //   get().calculateStats();
    } finally {
      set({ loading: false });
    }
  },

  // ─── CRUD Actions ────────────────────────────────
  addDepartment: async (tenantId, data) => {
    set({ loading: true });
    try {
      await axiosInstance.post(`/departments`, { tenantId, ...data });
      await get().fetchDepartments(tenantId);
      toast({ title: "Success", description: "Department added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add department", variant: "destructive" });
    } finally {
      set({ loading: false });
    }
  },

  editDepatment: async (tenantId, id, data) => {
    set({ loading: true });
    try {
      await axiosInstance.put(`/departments/${id}`, data);
      await get().fetchDepartments(tenantId);
      toast({ title: "Success", description: "Department updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update department", variant: "destructive" });
    } finally {
      set({ loading: false });
    }
  },

deleteDepartment: async (tenantId, id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/departments/${id}`);
      await get().fetchDepartments(tenantId);
      toast({ title: "Success", description: "Department deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete department", variant: "destructive" });
    } finally {
      set({ loading: false });
    }
  },

  bulkDelete: async (tenantId, ids) => {
    set({ loading: true });
    try {
      await Promise.all(ids.map((id) => axiosInstance.delete(`/departments/${id}`)));
      await get().fetchDepartments(tenantId);
      set({ selectedDepartments: [] });
      toast({
        title: "Success",
        description: `${ids.length} departments deleted successfully`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to delete departments", variant: "destructive" });
    } finally {
      set({ loading: false });
    }
  },

  // ─── Filtering / Stats ────────────────────────────────
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  applyFilters: () => {
    const { filters, departments } = get();
    let filtered = [...departments];

    if (filters.search) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          d.code.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.isActive !== undefined)
      filtered = filtered.filter((d) => d.isActive === filters.isActive);
    if (filters.branchId) filtered = filtered.filter((d) => d.branchId === filters.branchId);
    if (filters.managerId) filtered = filtered.filter((d) => d.manager?.id === filters.managerId);
    if (filters.parentDepartmentId)
      filtered = filtered.filter((d) => d.parentDepartment?.id === filters.parentDepartmentId);

    set({ filteredDepartments: filtered });
  },

  calculateStats: () => {
    const { departments } = get();
    const total = departments.length;
    const active = departments.filter((d) => d.isActive).length;
    const inactive = total - active;
    const totalBudget = departments.reduce((sum, d) => sum + (d.budget || 0), 0);
    const averageBudget = total ? totalBudget / total : 0;
    set({
      stats: { total, active, inactive, totalBudget, averageBudget },
    });
  },

  // ─── UI Helpers ────────────────────────────────
  getManagerName: (managerId) => {
    const user = get().users.find((u) => u.id === managerId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  },

  getBranchName: (branchId) => {
    const branch = get().branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown";
  },

  handleToggle: (id) =>
    set((state) => ({ expanded: state.expanded === id ? null : id })),

  setSelectedDepartment: (dep) => set({ selectedDepartment: dep }),
  setSelectedDepartments: (ids) => set({ selectedDepartments: ids }),
}));
