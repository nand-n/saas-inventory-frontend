import { Tenant } from "./tenant.types";

export interface AccountCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: any;
  updatedBy: any;
  tenant: Tenant;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  readonly: boolean;
}

export interface ChartOfAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: any;
  updatedBy: any;
  tenant: Tenant;
  name: string;
  code: string;
  categoryId?: string;
  category: AccountCategory;
  isActive: boolean;
  parent: ChartOfAccount | null;
  children: ChartOfAccount[];
  isLeaf: boolean;
  cashFlowCategory?: "operating" | "investing" | "financing";
  description: string;
  readOnly: boolean;
}
