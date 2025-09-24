import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { CreateInteractionDto, Interaction } from "@/types/crm.types";

interface InteractionState {
  interactions: Interaction[];
  loading: boolean;
  fetchInteractions: () => Promise<void>;
  createInteraction: (payload: CreateInteractionDto) => Promise<void>;
  updateInteraction: (id: string, payload: CreateInteractionDto) => Promise<void>;
  deleteInteraction: (id: string) => Promise<void>;
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  interactions: [],
  loading: false,
  fetchInteractions: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<Interaction[]>("/crm/interactions");
      set({ interactions: data });
    } finally {
      set({ loading: false });
    }
  },
  createInteraction: async (payload) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/crm/interactions", payload);
      await get().fetchInteractions();
    } finally {
      set({ loading: false });
    }
  },
  updateInteraction: async (id, payload) => {
    set({ loading: true });
    try {
      await axiosInstance.put(`/crm/interactions/${id}`, payload);
      await get().fetchInteractions();
    } finally {
      set({ loading: false });
    }
  },
  deleteInteraction: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/crm/interactions/${id}`);
      await get().fetchInteractions();
    } finally {
      set({ loading: false });
    }
  },
}));


