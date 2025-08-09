import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';

export interface TenantAdmin {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TenantConfig {
  currency: string;
  timezone: string;
  locale: string;
}

export interface Tenant {
  id: string;
  name: string;
  numberOfBranches: number;
  industryType: string;
  tenantAdmin: TenantAdmin;
  config: TenantConfig;
  isActive: boolean;
}

interface TenantState {
  tenants: Tenant[];
  fetchTenants: () => Promise<void>;
  createTenant: (data: Omit<Tenant, 'id'>) => Promise<void>;
  updateTenant: (id: string, data: Omit<Tenant, 'id'>) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
}

export const useTenant = create<TenantState>((set) => ({
  tenants: [],
  fetchTenants: async () => {
    const { data } = await axiosInstance.get<Tenant[]>('/tenants');
    set({ tenants: data });
  },
  createTenant: async (payload) => {
    await axiosInstance.post('/tenants', payload);
    await useTenant.getState().fetchTenants();
  },
  updateTenant: async (id, payload) => {
    await axiosInstance.put(`/tenants/${id}`, payload);
    await useTenant.getState().fetchTenants();
  },
  deleteTenant: async (id) => {
    await axiosInstance.delete(`/tenants/${id}`);
    await useTenant.getState().fetchTenants();
  },
}));
