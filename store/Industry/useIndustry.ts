import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';

export interface Industry {
  id?: string;
  name: string;
  description?: string;
}

interface IndustryState {
  industries: Industry[];
  fetchIndustries: () => Promise<void>;
  createIndustry: (data: Industry) => Promise<void>;
  updateIndustry: (id: string, data:Industry ) => Promise<void>;
  deleteIndustry: (id: string) => Promise<void>;
}

export const useIndustry = create<IndustryState>((set) => ({
  industries: [],

  fetchIndustries: async () => {
    const res = await axiosInstance.get('/industry-type');
    set({ industries: res.data });
  },

  createIndustry: async (data) => {
    await axiosInstance.post('/industry-type', data);
    await useIndustry.getState().fetchIndustries();
  },

  updateIndustry: async (id, data) => {
    await axiosInstance.put(`/industry-type/${id}`, data );
    await useIndustry.getState().fetchIndustries();
  },

  deleteIndustry: async (id) => {
    await axiosInstance.delete(`/industry-type/${id}`);
    await useIndustry.getState().fetchIndustries();
  },
}));
