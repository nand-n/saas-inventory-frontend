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

const useUserStore = create<UserStoreState>((set) => ({
  ...initialState,
  setUser: (user) => set(() => ({ ...user })),
  clearUser: () => set(initialState),
}));

export default useUserStore;