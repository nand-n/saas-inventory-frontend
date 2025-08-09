// purchase-order.types.ts
import { BaseEntity, FilterOptions } from './common.type';
import { Supplier } from './supplier.types';

// Optional: Enums for status
export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Supplier address type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Purchase Order Item type
export interface PurchaseOrderItem extends BaseEntity {
  productId: string,
  productName: string;
  unit_cost: number | string; 
  quantity: number;
  lineTotal: number | string;
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string;
  supplier: Supplier;
  supplierId?: string; 
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number | string;
  items: PurchaseOrderItem[];
}



export interface PurchaseOrderFormItem {
  productId: string; 
  quantity: number; 
  unit_cost: number;
}

export interface PurchaseOrderFormData {
  supplierId: string;
  status: "issued" | "completed" | "cancelled";
  orderDate: string; 
  expectedDeliveryDate?: string; 
  totalAmount: number;
  items: PurchaseOrderFormItem[];
}


export interface PoFilterOptions extends  FilterOptions {
  supplierId?:string
  orderNumber?:string | number
}