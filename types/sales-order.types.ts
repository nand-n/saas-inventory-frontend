// sales-order.types.ts
import { BaseEntity, FilterOptions } from './common.type';

// Optional: Enums for status
export enum SalesOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Customer address type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Customer type
export interface Customer extends BaseEntity {
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  status: string;
}

// Sales Order Item type
export interface SalesOrderItem extends BaseEntity {
  productId: string;
  productName: string;
  unit_price: number | string;
  quantity: number;
  lineTotal: number | string;
}

// Main Sales Order type
export interface SalesOrder extends BaseEntity {
  soNumber: string;
  customer: Customer;
  customerId?: string;
  status: SalesOrderStatus;
  orderDate: string;
  totalAmount: number | string;
  items: SalesOrderItem[];
}

// Form types for creating/updating sales orders
export interface SalesOrderFormItem {
  productId: string;
  quantity: number;
  unit_price: number;
}

export interface SalesOrderFormData {
  customerId: string;
  status:  SalesOrderStatus;
  orderDate: string;
  totalAmount: number;
  items: SalesOrderFormItem[];
}

// Filter options for listing
export interface SoFilterOptions extends FilterOptions {
  customerId?: string;
  orderNumber?: string | number;
}
