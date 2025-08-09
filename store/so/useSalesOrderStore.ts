import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { FilterOptions } from '@/types/common.type';
import { SalesOrder, SalesOrderFormData, SalesOrderStatus } from '@/types/sales-order.types';

interface SalesOrderStats {
  totalOrders: number;
  totalAmount: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface SalesOrderStore {
  salesOrders: SalesOrder[];
  filteredSalesOrders: SalesOrder[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: SalesOrderStats;

  fetchSalesOrders: () => Promise<void>;
  addSalesOrder: (data: SalesOrderFormData) => Promise<void>;
  updateSalesOrder: (id: string, data: SalesOrderFormData) => Promise<void>;
  deleteSalesOrder: (id: string) => Promise<void>;
  bulkDeleteSalesOrders: (ids: string[]) => Promise<void>;

  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useSalesOrderStore = create<SalesOrderStore>((set, get) => ({
  salesOrders: [],
  filteredSalesOrders: [],
  isLoading: false,
  filters: {},
  stats: {
    totalOrders: 0,
    totalAmount: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  },

  fetchSalesOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/sales-orders');
      set({ salesOrders: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addSalesOrder: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/sales-orders', data);
      const updated = [...get().salesOrders, res.data];
      set({ salesOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding sales order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSalesOrder: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/sales-orders/${id}`, data);
      const updated = get().salesOrders.map(so => so.id === id ? res.data : so);
      set({ salesOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating sales order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSalesOrder: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/sales-orders/${id}`);
      const updated = get().salesOrders.filter(so => so.id !== id);
      set({ salesOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting sales order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeleteSalesOrders: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/sales-orders/bulk-delete', { ids });
      const updated = get().salesOrders.filter(so => !ids.includes(so.id));
      set({ salesOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting sales orders:', error);
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
    const { salesOrders, filters } = get();
    let filtered = [...salesOrders];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(so =>
        so.soNumber.toLowerCase().includes(term) ||
        so.customer?.name?.toLowerCase().includes(term)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(so => so.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(so => so.orderDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(so => so.orderDate <= filters.dateTo!);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof SalesOrder];
        const bVal = b[filters.sortBy as keyof SalesOrder];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return filters.sortOrder === 'desc'
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return filters.sortOrder === 'desc'
            ? bVal - aVal
            : aVal - bVal;
        }

        return 0;
      });
    }

    set({ filteredSalesOrders: filtered });
  },

  calculateStats: () => {
    const { salesOrders } = get();
    const totalOrders = salesOrders.length;
    const totalAmount = salesOrders.reduce((sum, so) => sum + Number(so.totalAmount ?? 0), 0);

    const confirmed = salesOrders.filter(so => so.status === SalesOrderStatus.CONFIRMED).length;
    const completed = salesOrders.filter(so => so.status === SalesOrderStatus.COMPLETED).length;
    const cancelled = salesOrders.filter(so => so.status === SalesOrderStatus.CANCELLED).length;

    set({
      stats: {
        totalOrders,
        totalAmount,
        confirmed,
        completed,
        cancelled,
      },
    });
  }
}));
