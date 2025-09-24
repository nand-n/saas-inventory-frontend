import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { Customer } from '@/types/customers.types';
import { FilterOptions } from '@/types/common.type';

interface CustomersState {
  customers: Customer[];
  filteredCustomers: Customer[];
  isLoading: boolean;
  filters: Partial<FilterOptions & { status?: string }>;
  fetchCustomers: () => Promise<void>;
  addCustomer: (payload: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, payload: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  bulkDeleteCustomers: (ids: string[]) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions & { status?: string }>) => void;
  clearFilters: () => void;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  filteredCustomers: [],
  isLoading: false,
  filters: {},
  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get<Customer[]>('/customers');
      set({ customers: data, filteredCustomers: data });
    } finally {
      set({ isLoading: false });
    }
  },
  addCustomer: async (payload) => {
    await axiosInstance.post('/customers', payload);
    await get().fetchCustomers();
  },
  updateCustomer: async (id, payload) => {
    await axiosInstance.put(`/customers/${id}`, payload);
    await get().fetchCustomers();
  },
  deleteCustomer: async (id) => {
    await axiosInstance.delete(`/customers/${id}`);
    await get().fetchCustomers();
  },
  bulkDeleteCustomers: async (ids) => {
    await axiosInstance.post(`/customers/bulk-delete`, { ids });
    await get().fetchCustomers();
  },
  setFilters: (filters) => {
    set({ filters });
    const term = (filters.search || '').toLowerCase();
    const filtered = get().customers.filter((c) =>
      [c.name, c.code, c.contactPerson, c.email].some((v) =>
        (v || '').toLowerCase().includes(term)
      )
    );
    set({ filteredCustomers: filtered });
  },
  clearFilters: () => set({ filters: {}, filteredCustomers: get().customers }),
}));


