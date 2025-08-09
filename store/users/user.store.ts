// stores/user.store.ts
import { create } from 'zustand';

type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: null;
  updatedBy: null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  roles: string[];
  tenantId: string;
  branchId: null;
  subscriptionPlan: null;
};

type UserStoreState = User & {
  setUser: (user: User) => void;
  clearUser: () => void;
  superAdminUser?: User | null;
   setSuperAdminUser: (user: User) => void;
  getSuperAdminUser: () => User | null;
};

const initialState: User = {
  id: '',
  createdAt: '',
  updatedAt: '',
  deletedAt: null,
  createdByUser: null,
  updatedBy: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  roles: [],
  tenantId: '',
  branchId: null,
  subscriptionPlan: null,
};

const useUserStore = create<UserStoreState>((set , get) => ({
  ...initialState,
 superAdminUser: null,

  setUser: (user) => set(() => ({ ...user })),
  clearUser: () => set(initialState),

   setSuperAdminUser: (user) => set(() => ({ superAdminUser: { ...user } })),
  getSuperAdminUser: () => get().superAdminUser ?? null,
}));

export default useUserStore;