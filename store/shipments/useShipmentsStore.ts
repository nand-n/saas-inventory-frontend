import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { Shipment, ShipmentFormData, ShipmentStatus } from '@/types/shipment.types';

interface ShipmentsState {
  shipments: Shipment[];
  filteredShipments: Shipment[];
  isLoading: boolean;
  filters: Partial<{ status: string; carrier: string }>;
  stats: {
    totalShipments: number;
    inTransit: number;
    inCustoms: number;
    delivered: number;
  };
  fetchShipments: () => Promise<void>;
  addShipment: (payload: ShipmentFormData) => Promise<void>;
  updateShipment: (id: string, payload: ShipmentFormData) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  bulkDeleteShipments: (ids: string[]) => Promise<void>;
  setFilters: (filters: Partial<{ status: string; carrier: string }>) => void;
  clearFilters: () => void;
  // customs docs
  addNewCustomsDocument: (payload: any) => Promise<void>;
}

export const useShipmentsStore = create<ShipmentsState>((set, get) => ({
  shipments: [],
  filteredShipments: [],
  isLoading: false,
  filters: {},
  stats: {
    totalShipments: 0,
    inTransit: 0,
    inCustoms: 0,
    delivered: 0,
  },
  fetchShipments: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get<Shipment[]>('/shipments');
      const stats = {
        totalShipments: data.length,
        inTransit: data.filter((s) => s.status === ShipmentStatus.IN_TRANSIT).length,
        inCustoms: data.filter((s) => s.status === ShipmentStatus.IN_CUSTOMS).length,
        delivered: data.filter((s) => s.status === ShipmentStatus.DELIVERED).length,
      };
      set({ shipments: data, filteredShipments: data, stats });
    } finally {
      set({ isLoading: false });
    }
  },
  addShipment: async (payload) => {
    await axiosInstance.post('/shipments', payload);
    await get().fetchShipments();
  },
  updateShipment: async (id, payload) => {
    await axiosInstance.put(`/shipments/${id}`, payload);
    await get().fetchShipments();
  },
  deleteShipment: async (id) => {
    await axiosInstance.delete(`/shipments/${id}`);
    await get().fetchShipments();
  },
  bulkDeleteShipments: async (ids) => {
    await axiosInstance.post(`/shipments/bulk-delete`, { ids });
    await get().fetchShipments();
  },
  setFilters: (filters) => {
    set({ filters });
    const { shipments } = get();
    const filtered = shipments.filter((s) => {
      if (filters.status && s.status !== filters.status) return false;
      if (filters.carrier && s.carrier !== filters.carrier) return false;
      return true;
    });
    set({ filteredShipments: filtered });
  },
  clearFilters: () => set({ filters: {}, filteredShipments: get().shipments }),
  addNewCustomsDocument: async (payload) => {
    await axiosInstance.post('/customs-documents', payload);
    await get().fetchShipments();
  },
}));


