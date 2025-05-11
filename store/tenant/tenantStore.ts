import { Tenant } from '@/types/tenant.types';
import { create } from 'zustand';

type TenantStoreState = Omit<Tenant, 'configurations'> & {
  setTenant: (data: Omit<Tenant, 'configurations'>) => void;
};

const useTenantStore = create<TenantStoreState>((set) => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  deletedAt: null,
  createdByUser: null,
  updatedBy: null,
  name: '',
  contactEmail: null,
  numberOfBranches: 0,
  branches: [],
  isActive: false,
  industryType: null,
  currentSubscriptionPlan: null,
  setTenant: (data) => set((state) => ({
    ...state,
    ...data,
    industryType: data.industryType ?? null
  })),
}));

export default useTenantStore;