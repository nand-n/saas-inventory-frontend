import { BaseEntity } from './common.type';
import { SalesOrder } from './sales-order.types';
import { Shipment } from './shipment.types';

// Optional: Enum for customer status
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Address type for customer
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
// Customer entity type
export interface Customer extends BaseEntity {
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  status: CustomerStatus | string;
  salesOrders: SalesOrder[];
  shipments: Shipment[];
}

// Form data for creating/updating a customer
export interface CustomerFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  status: CustomerStatus | string;
}
