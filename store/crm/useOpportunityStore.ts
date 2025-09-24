import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { CreateOpportunityDto, Opportunity } from "@/types/crm.types";

interface OpportunityState {
  opportunities: Opportunity[];
  loading: boolean;
  fetchOpportunities: () => Promise<void>;
  createOpportunity: (payload: CreateOpportunityDto) => Promise<void>;
  updateOpportunity: (id: string, payload: CreateOpportunityDto) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
}

export const useOpportunityStore = create<OpportunityState>((set, get) => ({
  opportunities: [],
  loading: false,
  fetchOpportunities: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<Opportunity[]>("/crm/opportunities");
      set({ opportunities: data });
    } finally {
      set({ loading: false });
    }
  },
  createOpportunity: async (payload) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/crm/opportunities", payload);
      await get().fetchOpportunities();
    } finally {
      set({ loading: false });
    }
  },
  updateOpportunity: async (id, payload) => {
    set({ loading: true });
    try {
      await axiosInstance.put(`/crm/opportunities/${id}`, payload);
      await get().fetchOpportunities();
    } finally {
      set({ loading: false });
    }
  },
  deleteOpportunity: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/crm/opportunities/${id}`);
      await get().fetchOpportunities();
    } finally {
      set({ loading: false });
    }
  },
}));


