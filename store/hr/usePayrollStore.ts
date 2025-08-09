import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { Payroll } from '@/types/payroll.types';
import { FilterOptions } from '@/types/common.type';

interface PayrollStats {
  total: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  paid: number;
  draft: number;
}

interface PayrollStore {
  payrolls: Payroll[];
  filteredPayrolls: Payroll[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: PayrollStats;
  fetchPayrolls: () => Promise<void>;
  addPayroll: (payroll: Partial<Payroll>) => Promise<void>;
  updatePayroll: (id: string, payroll: Partial<Payroll>) => Promise<void>;
  deletePayroll: (id: string) => Promise<void>;
  bulkDeletePayrolls: (ids: string[]) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const usePayrollStore = create<PayrollStore>((set, get) => ({
  payrolls: [],
  filteredPayrolls: [],
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
    const totalTaxes = payrolls.reduce(
      (sum, p) =>
        sum +
        (p.federalTax || 0) +
        (p.stateTax || 0) +
        (p.socialSecurityTax || 0) +
        (p.medicareTax || 0),
      0
    );
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
