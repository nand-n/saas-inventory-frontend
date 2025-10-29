import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { CreatePayrollAdjustmentDto, CreatePayrollDto, CreatePayrollRunDto, Payroll, PayrollAdjustment, PayrollRun, PayrollRunStatus, UpdatePayrollDto, UpdatePayrollRunDto } from '@/types/payroll.types';
import { FilterOptions } from '@/types/common.type';

interface PayrollStats {
  total: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  paid: number;
  draft: number;
}

export interface PayrollStore {
  // ============================
  // 📊 Core Payroll State
  // ============================
  payrolls: Payroll[];
  filteredPayrolls: Payroll[];
  payrollRuns: PayrollRun[];
  adjustments: PayrollAdjustment[];

  isLoading: boolean;
  filters: FilterOptions;
  stats: PayrollStats;

  // ============================
  // 📥 Payroll CRUD
  // ============================
  fetchPayrolls: () => Promise<void>;
  addPayroll: (payroll: Partial<CreatePayrollDto>) => Promise<void>;
  updatePayroll: (id: string, payroll: Partial<UpdatePayrollDto>) => Promise<void>;
  deletePayroll: (id: string) => Promise<void>;
  bulkDeletePayrolls: (ids: string[]) => Promise<void>;

  // ============================
  // 💰 Payroll Adjustments
  // ============================
  addAdjustment: (adjustment: CreatePayrollAdjustmentDto) => Promise<void>;
  fetchAdjustments: (payrollId?: string) => Promise<void>;
  settleAdjustment: (adjustmentId: string) => Promise<void>;

  // ============================
  // 🧾 Payroll Runs
  // ============================
  fetchPayrollRuns: () => Promise<void>;
  updatePayrollRun:( id:string,data:UpdatePayrollRunDto) => Promise<void>
  changePayrollRunStatus:( id:string,data:{status:PayrollRunStatus}) => Promise<void>

  addPayrollRun: (run: CreatePayrollRunDto) => Promise<void>;

  setSelectedRuns: (id:string[]) => void
  selectedRuns: string[]

  // ============================
  // 🔍 Filters & Stats
  // ============================
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;


  
}

export const usePayrollStore = create<PayrollStore>((set, get) => ({
  payrolls: [],
  filteredPayrolls: [],
  payrollRuns :[],
  adjustments :[],
  selectedRuns: [],
  
  isLoading: false,
  filters: {},
  stats: {
    total: 0,
    totalGrossPay: 0,
    totalNetPay: 0,
    totalTaxes: 0,
    paid: 0,
    draft: 0,
  },

  fetchPayrolls: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/payrolls');
      set({ payrolls: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPayroll: async (payrollData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/payrolls', payrollData);
      const { payrolls } = get();
      set({ payrolls: [...payrolls, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding payroll:', error);
    } finally {
      set({ isLoading: false });
    }
  },

    addAdjustment: async (adjestmentData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/payrolls/adjustments/${adjestmentData.payrollId}`, adjestmentData);
      const { payrolls } = get();
      set({ payrolls: [...payrolls, res.data] });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding Payroll Adjestments:', error);
    } finally {
      set({ isLoading: false });
    }
  },

    fetchAdjustments: async (payrollId) => {
    set({ isLoading: true });
    try {
      const endpoint = payrollId ? `/payrolls/${payrollId}/adjustments` : `/payrolls/adjustments`;
      const res = await axiosInstance.get(endpoint);
      set({ adjustments: res.data });
    } catch (error) {
      console.error('Error fetching payroll adjustments:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  settleAdjustment: async (adjustmentId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/payrolls/adjustments/${adjustmentId}/settle`);
      const { adjustments } = get();
      const updated = adjustments.map(a => (a.id === adjustmentId ? res.data : a));
      set({ adjustments: updated });
    } catch (error) {
      console.error('Error settling payroll adjustment:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePayroll: async (id, payrollData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/payrolls/${id}`, payrollData);
      const { payrolls } = get();
      const updatedPayrolls = payrolls.map(p =>
        p.id === id ? res.data : p
      );
      set({ payrolls: updatedPayrolls });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating payroll:', error);
    } finally {
      set({ isLoading: false });
    }
  },

    fetchPayrollRuns: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/payrolls/run');
      set({ payrollRuns: res.data });
    } catch (error) {
      console.error('Error fetching payroll runs:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPayrollRun: async (runData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/payrolls/run', runData);
      const { payrollRuns } = get();
      set({ payrollRuns: [...payrollRuns, res.data] });
    } catch (error) {
      console.error('Error adding payroll run:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePayrollRun:async (id, data) =>{
  set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/payrolls/run/${id}/update`, data);
      const { payrollRuns } = get();
      set({ payrollRuns: [...payrollRuns, res.data] });
    } catch (error) {
      console.error('Error updating payroll run:', error);
    } finally {
      set({ isLoading: false });
    }
  },


  changePayrollRunStatus:async (id, data) =>{
  set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/payrolls/run/${id}/status`, data);
      const { payrollRuns } = get();
      set({ payrollRuns: [...payrollRuns, res.data] });
    } catch (error) {
      console.error('Error updating payroll run:', error);
    } finally {
      set({ isLoading: false });
    }
  },

setSelectedRuns: (ids: string[] =[]) => {
  const { selectedRuns } = get();

  if (Array.isArray(ids)) {
    // If an array is passed (e.g., select all), replace the entire selectedRuns
    set({ selectedRuns: ids });
  } else {
    // If a single ID is passed, toggle it
    const id = ids;
    if (selectedRuns.includes(id)) {
      // remove if already selected
      set({ selectedRuns: selectedRuns.filter((runId) => runId !== id) });
    } else {
      // add if not selected
      set({ selectedRuns: [...selectedRuns, id] });
    }
  }
},

  deletePayroll: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/payrolls/${id}`);
      const { payrolls } = get();
      set({ payrolls: payrolls.filter(p => p.id !== id) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting payroll:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeletePayrolls: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/payrolls/bulk-delete', { ids });
      const { payrolls } = get();
      set({ payrolls: payrolls.filter(p => !ids.includes(p.id)) });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting payrolls:', error);
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
    const { payrolls, filters } = get();
    let filtered = [...payrolls];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        `${p.employee.firstName} ${p.employee.lastName}`.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(p => new Date(p.payPeriodStart) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(p => new Date(p.payPeriodEnd) <= new Date(filters.dateTo!));
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Payroll];
        const bValue = b[filters.sortBy as keyof Payroll];

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

    set({ filteredPayrolls: filtered });
  },

  calculateStats: () => {
    const { payrolls } = get();
    const total = payrolls.length;
    const totalGrossPay = payrolls.reduce((sum, p) => sum + (p.grossPay || 0), 0);
    const totalNetPay = payrolls.reduce((sum, p) => sum + (p.netPay || 0), 0);
    const totalTaxes = payrolls.reduce((sum, p) => {
      // If adjustments is an array, sum the numeric amount-like fields from each adjustment
      if (Array.isArray(p.adjustments)) {
        const adjSum = p.adjustments.reduce((s, a) => {
          // support common fields that might represent an adjustment amount
          const val = (a as any).amount ?? (a as any).taxAmount ?? (a as any).value ?? 0;
          const num = typeof val === 'number' ? val : Number(val) || 0;
          return s + num;
        }, 0);
        return sum + adjSum;
      }

      // Fallback: sum individual tax fields if present on payroll
      const federal = (p as any).federalTax ?? 0;
      const state = (p as any).stateTax ?? 0;
      const social = (p as any).socialSecurityTax ?? 0;
      const medicare = (p as any).medicareTax ?? 0;
      return sum + federal + state + social + medicare;
    }, 0);
    const paid = payrolls.filter(p => p.status === 'paid').length;
    const draft = payrolls.filter(p => p.status === 'draft').length;

    set({
      stats: {
        total,
        totalGrossPay,
        totalNetPay,
        totalTaxes,
        paid,
        draft,
      },
    });
  },
}));
