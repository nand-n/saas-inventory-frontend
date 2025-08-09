import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';

export interface Plan {
  id: string;
  plan_name: string;
  description: string;
  currency: string;
  current_price: number;
  isFree: boolean;
  duration: number;
  days_left: number;
  slug: string;
  recuring: string;
  highlights: { description: string; disabled?: boolean }[];
  features: { section: string; name: string; value: string | number | boolean }[];
}

interface PlanState {
  plans: Plan[];
  fetchPlans: () => Promise<void>;
  createPlan: (data: Omit<Plan, 'id'>) => Promise<void>;
  updatePlan: (id: string, data: Omit<Plan, 'id'>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export const usePlan = create<PlanState>((set) => ({
  plans: [],

  fetchPlans: async () => {
    const { data } = await axiosInstance.get<Plan[]>('/plans');
    set({ plans: data });
  },

  createPlan: async (planData) => {
    await axiosInstance.post('/plans', planData);
    await usePlan.getState().fetchPlans();
  },

  updatePlan: async (id, planData) => {
    await axiosInstance.put(`/plans/${id}`, planData);
    await usePlan.getState().fetchPlans();
  },

  deletePlan: async (id) => {
    await axiosInstance.delete(`/plans/${id}`);
    await usePlan.getState().fetchPlans();
  },
}));
