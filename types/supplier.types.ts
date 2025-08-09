import { BaseEntity, FilterOptions } from "./common.type";

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  weight?: number | null;
  dimensions?: Dimensions | null;
  barcode?: string | null;
  isActive: boolean;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Shipment extends BaseEntity {
  shipmentNumber: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  carrier?: string;
}

export interface Supplier extends BaseEntity {
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  status: 'active' | 'inactive';
  performanceRating: number;
  leadTimeDays: number;
  paymentTerms: string;
  notes?: string;
  products: Product[];
  shipments: Shipment[];
}

// DTO for creating supplier
export interface CreateSupplierDto {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  status: 'active' | 'inactive';
  performanceRating: number;
  leadTimeDays: number;
  paymentTerms: string;
  notes?: string;
  productIds?: string[];
  newProducts?: NewProductDto[];
}

export interface NewProductDto {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  weight?: number;
  dimensions?: Dimensions;
  barcode?: string;
  isActive?: boolean;
}


export interface SupplierFilterOptions extends FilterOptions {
  country?: string;
  city?: string;
}