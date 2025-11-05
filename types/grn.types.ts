import { PurchaseOrder } from "./po.types";

export interface GRNItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  unit?: string;
  receivedQuantity: number;
  pendingQuantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  qcStatus?: GRNQCStatus;
  qcRemarks?: string;
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  createdAt: string;
  updatedAt: string;
  purchaseOrderId: string;
  receivedDate: string;
  receivedBy?: string;
  warehouse?: string;
  status: GoodsReceiptStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  carrier?: string;
  trackingNumber?: string;
  deliveryDate?: string;
  qcStatus?: GRNQCStatus;
  qcRemarks?: string;
  items: GRNItem[];
  purchaseOrder?:PurchaseOrder
}

export interface CreateGRNItemDto {
  name: string;
  unit?: string;
  receivedQuantity: number;
  pendingQuantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  qcStatus?: GRNQCStatus;
  qcRemarks?: string;
}

export interface CreateGoodsReceiptDto {
  grnNumber: string;
  purchaseOrderId: string;
  receivedDate: string;
  receivedBy?: string;
  warehouse?: string;
  carrier?: string;
  trackingNumber?: string;
  deliveryDate?: string;
  items: CreateGRNItemDto[];
}

export interface UpdateGoodsReceiptDto {
  grnNumber?: string;
  purchaseOrderId?: string;
  receivedDate?: string;
  receivedBy?: string;
  warehouse?: string;
  carrier?: string;
  trackingNumber?: string;
  deliveryDate?: string;
  status?: GoodsReceiptStatus;
  qcStatus?: GRNQCStatus;
  qcRemarks?: string;
  items?: CreateGRNItemDto[];
}

// Enums for frontend
export enum GoodsReceiptStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum GRNQCStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}
