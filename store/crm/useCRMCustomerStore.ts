import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import { CRMCustomer, CreateCRMCustomerDto, UpdateCRMCustomerDto } from "@/types/crm.types";

interface CRMCustomerState {
  customers: CRMCustomer[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
  createCustomer: (payload: CreateCRMCustomerDto) => Promise<void>;
  updateCustomer: (id: string, payload: UpdateCRMCustomerDto) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCRMCustomerStore = create<CRMCustomerState>((set) => ({
  customers: [],
  loading: false,
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get<CRMCustomer[]>("/crm/customers");
      set({ customers: data });
    } finally {
      set({ loading: false });
    }
  },
  createCustomer: async (payload) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/crm/customers", payload);
      const { data } = await axiosInstance.get<CRMCustomer[]>("/crm/customers");
      set({ customers: data });
    } finally {
      set({ loading: false });
    }
  },
  updateCustomer: async (id, payload) => {
    set({ loading: true });
    try {
      await axiosInstance.put(`/crm/customers/${id}`, payload);
      const { data } = await axiosInstance.get<CRMCustomer[]>("/crm/customers");
      set({ customers: data });
    } finally {
      set({ loading: false });
    }
  },
  deleteCustomer: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/crm/customers/${id}`);
      const { data } = await axiosInstance.get<CRMCustomer[]>("/crm/customers");
      set({ customers: data });
    } finally {
      set({ loading: false });
    }
  },
}));


