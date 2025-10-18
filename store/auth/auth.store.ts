import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string;
  refreshToken: string;
  tokenExpires: string;
  tenantId: string;
  setAuth: (data: Omit<AuthState, 'setAuth' | 'clearAuth'>) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      refreshToken: '',
      tokenExpires: '',
      tenantId: '',
      setAuth: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
      clearAuth: () =>
        set(() => ({
          token: '',
          refreshToken: '',
          tokenExpires: '',
          tenantId: '',
        })),
    }),
    {
      name: 'auth-storage', 
    }
  )
);

export default useAuthStore;
