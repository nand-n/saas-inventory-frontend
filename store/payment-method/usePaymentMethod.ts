// store/usePaymentMethod.ts
import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';

export interface PaymentMethod {
  id: string;
  payment_method: string;
  currency: string;
  currencyCode: string;
  card_number?: string;
  isFree?: boolean;
  phone_number?: string;
  planId?: string;
}

interface PaymentMethodState {
  methods: PaymentMethod[];
  fetchMethods: () => Promise<void>;
  createMethod: (data: Omit<PaymentMethod, 'id'>) => Promise<void>;
  updateMethod: (id: string, data: Omit<PaymentMethod, 'id'>) => Promise<void>;
  deleteMethod: (id: string) => Promise<void>;
}

export const usePaymentMethod = create<PaymentMethodState>((set) => ({
  methods: [],

  fetchMethods: async () => {
    const res = await axiosInstance.get<PaymentMethod[]>('/payment-methods');
    set({ methods: res.data });
  },

  createMethod: async (data) => {
    await axiosInstance.post('/payment-methods', data);
    await usePaymentMethod.getState().fetchMethods();
  },

  updateMethod: async (id, data) => {
    await axiosInstance.put(`/payment-methods/${id}`, data);
    await usePaymentMethod.getState().fetchMethods();
  },

  deleteMethod: async (id) => {
    await axiosInstance.delete(`/payment-methods/${id}`);
    await usePaymentMethod.getState().fetchMethods();
  },
}));
