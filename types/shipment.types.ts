import { BaseEntity, FilterOptions } from './common.type';
import { PurchaseOrder } from './po.types';
import { SalesOrder } from './sales-order.types';

// Shipment Type Enum
export enum ShipmentType {
  IMPORT = 'import',
  EXPORT = 'export',
  DOMESTIC = 'domestic'
}

// Shipment Status Enum
export enum ShipmentStatus {
  PENDING = 'pending',
  IN_CUSTOMS = 'in_customs',
  IN_TRANSIT = 'in_transit',
  CLEARED = 'cleared',
  DELIVERED = 'delivered',
  DELAYED = 'delayed',
  RETURNED = 'returned',
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

  /** Relations */
  orderId?: string;
  supplierId?: string;
  customerId?: string;

  /** Core shipping info */
  carrier: string;
  originAddress: Address;
  destinationAddress: Address;
  shippedDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  weight?: number;
  shippingCost?: number;

  /** Container & vessel info */
  containerNumber?: string;
  vesselName?: string;
  portOfLoading?: string;
  portOfDischarge?: string;

  /** Customs info */
  customsInfo?: CustomsInfo;

  /** Domestic delivery–specific fields */
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
  vehiclePlateNumber?: string;
  deliveryProofUrl?: string; // signed receipt or photo
  recipientName?: string;
  recipientSignatureUrl?: string;
  isPartialDelivery?: boolean;

  /** Additional info */
  notes?: string;

  /** Relations */
  customsDocuments?: CustomsDocument[];
  purchaseOrders?: PurchaseOrder[];
  salesOrders?: SalesOrder[];
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


export interface CreateShipmentForm {
  trackingNumber: string;
  type?: ShipmentType;
  status?: ShipmentStatus;

  orderId?: string;
  supplierId?: string;
  customerId?: string;

  carrier: string;
  originAddress: Address;
  destinationAddress: Address;

  shippedDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;

  weight?: number;
  shippingCost?: number;

  containerNumber?: string;
  vesselName?: string;
  portOfLoading?: string;
  portOfDischarge?: string;

  customsInfo?: CustomsInfo;

  /** 🚚 Domestic delivery–specific fields */
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
  vehiclePlateNumber?: string;
  deliveryProofUrl?: string;
  recipientName?: string;
  recipientSignatureUrl?: string;

  isPartialDelivery?: boolean;
  notes?: string;
}

// Filter options for listing shipments
export interface ShipmentFilterOptions extends FilterOptions {
  trackingNumber?: string;
  status?: ShipmentStatus;
  type?: ShipmentType;
  carrier?: string;
}

// Customs Documents
export enum CustomsDocumentType {
  COMMERCIAL_INVOICE = 'commercial_invoice',
  PACKING_LIST = 'packing_list',
  CERTIFICATE_OF_ORIGIN = 'certificate_of_origin',
  BILL_OF_LADING = 'bill_of_lading',
  EXPORT_LICENSE = 'export_license',
  IMPORT_LICENSE = 'import_license',
}

export enum CustomsDocumentStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface HSCodeInfo {
  hsCode: string;
  description: string;
  dutyRate: number; // stored as fraction e.g. 0.05 for 5%
  taxRate: number;  // stored as fraction
}

export interface DocumentAttachment {
  fileName: string;
  fileUrl: string;
  fileSize: number; // in bytes
}

export interface ShipmentSummary {
  trackingNumber: string;
  carrier: string;
  type: string;
  status: string;
  containerNumber?: string;
  vesselName?: string;
}

export interface CustomsDocument extends BaseEntity {
  documentNumber: string;
  type: CustomsDocumentType;
  status: CustomsDocumentStatus;
  issuedDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  issuingCountry: string;
  description?: string;
  declaredValue?: number | string;
  currency?: string;
  notes?: string;
  requiresApproval: boolean;
  shipmentId: string;
  content?:string

  // Workflow tracking
  approvedBy?: string; // userId
  approvedByUserInfo?: { firstName: string; lastName: string; email: string };
  approvedDate?: string;

  reviewedBy?: string; // userId
  reviewedByUserInfo?: { firstName: string; lastName: string; email: string };
  reviewedDate?: string;
  reviewNotes?: string;

  rejectedBy?: string; // userId
  rejectedByUserInfo?: { firstName: string; lastName: string; email: string };
  rejectedDate?: string;
  rejectionReason?: string;

  // Relations
  hsCodeInfo?: HSCodeInfo[];
  attachments?: DocumentAttachment[];
  shipment?: ShipmentSummary;
}

export interface CreateCustomsDocumentForm {
  documentNumber: string;
  type: CustomsDocumentType;
  status: CustomsDocumentStatus;
  issuedDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  issuingCountry: string;
  description?: string;
  declaredValue?: number;
  currency?: string;
  notes?: string;
  requiresApproval: boolean;
  shipmentId: string;
}

export interface CustomsDocumentFilterOptions extends FilterOptions {
  search?: string;
  type?: CustomsDocumentType;
  status?: CustomsDocumentStatus;
  requiresApproval?: boolean;
  issuingAuthority?: string;
  issuingCountry?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?:
    | 'documentNumber'
    | 'issuedDate'
    | 'expiryDate'
    | 'issuingAuthority'
    | 'status'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
