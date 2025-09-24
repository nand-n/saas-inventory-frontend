// src/types/logistics.type.ts

export type LogisticsPartnerType =
  | "carrier"
  | "freight_forwarder"
  | "customs_broker"
  | "warehouse"
  | "logistics_provider";

export type LogisticsPartnerStatus = "active" | "inactive" | "suspended";

export interface LogisticsPartner {
  id: string;
  name: string;
  type: LogisticsPartnerType;
  services: string[];
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  rating: number; // 1–5
  status: LogisticsPartnerStatus;
  contractStartDate: string; // ISO date string
  contractEndDate?: string;  // ISO date string or undefined
  specializations: string[];
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export type LogisticsPartnerFormData = Omit<
  LogisticsPartner,
  "id" | "createdAt" | "updatedAt"
>;
