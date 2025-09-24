

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  type: CustomerType;
  updatedAt: string;
}

export interface CreateCRMCustomerDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: CustomerType;
}

export type UpdateCRMCustomerDto = Partial<CreateCRMCustomerDto>;

export enum CustomerType {
  IMPORTER = "importer",
  EXPORTER = "exporter",
  RETAILER = "retailer",
}

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  type: CustomerType;
  createdAt?: string;
}

export enum OpportunityStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  WON = "won",
  LOST = "lost",
}

export interface Opportunity {
  id: string;
  customer: CRMCustomer;
  title: string;
  estimatedValue?: number | null;
  status: OpportunityStatus;
  expectedClosingDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOpportunityDto {
  customerId: string;
  title: string;
  estimatedValue?: number;
  status: OpportunityStatus;
  expectedClosingDate?: string;
}

export enum InteractionType {
  CALL = "call",
  EMAIL = "email",
  MEETING = "meeting",
  NOTE = "note",
}

export interface Interaction {
  id: string;
  customer: CRMCustomer;
  type: InteractionType;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInteractionDto {
  customerId: string;
  type: InteractionType;
  description: string;
}


