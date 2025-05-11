import { create } from 'zustand';

type AuthState = {
  token: string;
  refreshToken: string;
  tokenExpires: string;
  tenantId: string;
  setAuth: (data: {
    token: string;
    refreshToken: string;
    tokenExpires: string;
    tenantId: string;
  }) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  token: '',
  refreshToken: '',
  tokenExpires: '',
  tenantId: '',
  setAuth: (data) => set(() => ({ ...data })),
  clearAuth: () => set({
    token: '',
    refreshToken: '',
    tokenExpires: '',
    tenantId: ''
  }),
}));

export default useAuthStore;