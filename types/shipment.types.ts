import { BaseEntity, FilterOptions } from './common.type';

// Shipment Type Enum
export enum ShipmentType {
  IMPORT = 'import',
  EXPORT = 'export',
  DOMESTIC = 'domestic'
}

// Shipment Status Enum
export enum ShipmentStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Address type (reuse same Address)
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Customs Info type
export interface CustomsInfo {
  declarationNumber: string;
  dutyAmount: number;
  taxAmount: number;
  clearanceDate: string; // ISO date string
}

// Shipment type
export interface Shipment extends BaseEntity {
  trackingNumber: string;
  type: ShipmentType;
  status: ShipmentStatus;
  orderId?: string;
  supplierId?: string;
  carrier: string;
  originAddress: Address;
  destinationAddress: Address;
  shippedDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  weight?: number;
  shippingCost?: number;
  containerNumber?: string;
  vesselName?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  customsInfo?: CustomsInfo;
  notes?: string;
}

// Form data for creating/updating a shipment
export interface ShipmentFormData {
  trackingNumber: string;
  type?: ShipmentType;
  status?: ShipmentStatus;
  orderId?: string;
  supplierId?: string;
  carrier: string;
  originAddress: Address;
  destinationAddress: Address;
  shippedDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  weight?: number;
  shippingCost?: number;
  containerNumber?: string;
  vesselName?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  customsInfo?: CustomsInfo;
  notes?: string;
}

// Filter options for listing shipments
export interface ShipmentFilterOptions extends FilterOptions {
  trackingNumber?: string;
  status?: ShipmentStatus;
  type?: ShipmentType;
  carrier?: string;
}
