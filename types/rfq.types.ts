// @/types/rfq.types.ts

import { Supplier } from "./supplier.types";

export enum RFQStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  QUOTED = 'quoted',
  REJECTED = 'rejected',
  AWARDED = 'awarded',
  CLOSED = 'closed',
}


export interface RFQItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdByUser?: string | null;
  updatedBy?: string | null;
  name: string;
  productId: string;
  quantity: number;
  expectedUnitCost?: number;
  lineTotal?: number;
}

export interface RFQ {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdByUser?: string | null;
  updatedBy?: string | null;
  rfqNumber: string;
  supplier: Supplier;
  status: RFQStatus;
  issuedDate?: string; // ISO date string
  validUntil?: string; // ISO date string
  totalAmount?: number;
  termsAndConditions?: string;
  items: RFQItem[];
}

export interface CreateRFQItemDto {
  productName: string;
  productId: string;
  quantity: number;
  expectedUnitCost?: number;
  lineTotal?: number;
}

export interface CreateRFQDto {
  supplierId?: string;
  status?: RFQStatus;
  issuedDate?: string;
  validUntil?: string;
  totalAmount?: number;
  termsAndConditions?: string;
  items: CreateRFQItemDto[];
}

export interface UpdateRFQDto {
  rfqNumber?: string;
  supplierId?: string;
  status?: RFQStatus;
  issuedDate?: string;
  validUntil?: string;
  totalAmount?: number;
  termsAndConditions?: string;
  items?: CreateRFQItemDto[];
}
