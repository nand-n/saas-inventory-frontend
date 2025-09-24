import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import {
  Risk,
  RiskFilters,
  CreateRiskRequest,
  UpdateRiskRequest,
} from "@/types/risk.types";

interface RiskState {
  risks: Risk[];
  loading: boolean;
  lastAppliedFilters: RiskFilters;
  fetchRisks: (filters?: RiskFilters) => Promise<void>;
  createRisk: (payload: CreateRiskRequest) => Promise<void>;
  updateRisk: (id: string, payload: UpdateRiskRequest) => Promise<void>;
  deleteRisk: (id: string) => Promise<void>;
}

export const useRiskStore = create<RiskState>((set, get) => ({
  risks: [],
  loading: false,
  lastAppliedFilters: {},
  fetchRisks: async (filters = get().lastAppliedFilters) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<Risk[]>("/risks", {
        params: filters,
      });
      set({ risks: data, lastAppliedFilters: filters });
    } finally {
      set({ loading: false });
    }
  },
  createRisk: async (payload) => {
    await axiosInstance.post("/risks", payload);
    await get().fetchRisks();
  },
  updateRisk: async (id, payload) => {
    await axiosInstance.put(`/risks/${id}`, payload);
    await get().fetchRisks();
  },
  deleteRisk: async (id) => {
    await axiosInstance.delete(`/risks/${id}`);
    await get().fetchRisks();
  },
}));


