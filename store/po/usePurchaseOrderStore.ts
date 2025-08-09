// usePurchaseOrderStore.ts
import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { FilterOptions } from '@/types/common.type';
import { PurchaseOrder, PurchaseOrderFormData, PurchaseOrderStatus } from '@/types/po.types';

interface PurchaseOrderStats {
  totalOrders: number;
  totalAmount: number;
  issued: number;
  completed: number;
  cancelled: number;
}

interface PurchaseOrderStore {
  purchaseOrders: PurchaseOrder[];
  filteredPurchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: PurchaseOrderStats;

  fetchPurchaseOrders: () => Promise<void>;
  addPurchaseOrder: (data: PurchaseOrderFormData) => Promise<void>;
  updatePurchaseOrder: (id: string, data: PurchaseOrderFormData) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  bulkDeletePurchaseOrders: (ids: string[]) => Promise<void>;

  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const usePurchaseOrderStore = create<PurchaseOrderStore>((set, get) => ({
  purchaseOrders: [],
  filteredPurchaseOrders: [],
  isLoading: false,
  filters: {},
  stats: {
    totalOrders: 0,
    totalAmount: 0,
    issued: 0,
    completed: 0,
    cancelled: 0,
  },

  fetchPurchaseOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/purchase-orders');
      set({ purchaseOrders: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPurchaseOrder: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/purchase-orders', data);
      const updated = [...get().purchaseOrders, res.data];
      set({ purchaseOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding purchase order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePurchaseOrder: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/purchase-orders/${id}`, data);
      const updated = get().purchaseOrders.map(po => po.id === id ? res.data : po);
      set({ purchaseOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating purchase order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePurchaseOrder: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/purchase-orders/${id}`);
      const updated = get().purchaseOrders.filter(po => po.id !== id);
      set({ purchaseOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting purchase order:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeletePurchaseOrders: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/purchase-orders/bulk-delete', { ids });
      const updated = get().purchaseOrders.filter(po => !ids.includes(po.id));
      set({ purchaseOrders: updated });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting purchase orders:', error);
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
    const { purchaseOrders, filters } = get();
    let filtered = [...purchaseOrders];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(po =>
        po.poNumber.toLowerCase().includes(term) ||
        po.supplier?.name?.toLowerCase().includes(term)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(po => po.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(po => po.orderDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(po => po.orderDate <= filters.dateTo!);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof PurchaseOrder];
        const bVal = b[filters.sortBy as keyof PurchaseOrder];

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

    set({ filteredPurchaseOrders: filtered });
  },

  calculateStats: () => {
    const { purchaseOrders } = get();
    const totalOrders = purchaseOrders.length;
    const totalAmount = purchaseOrders.reduce((sum, po) => sum + Number(po.totalAmount ?? 0), 0);

    const issued = purchaseOrders.filter(po => po.status === PurchaseOrderStatus.ISSUED).length;
    const completed = purchaseOrders.filter(po => po.status === PurchaseOrderStatus.COMPLETED).length;
    const cancelled = purchaseOrders.filter(po => po.status === PurchaseOrderStatus.CANCELLED).length;

    set({
      stats: {
        totalOrders,
        totalAmount,
        issued,
        completed,
        cancelled,
      },
    });
  }
}));
