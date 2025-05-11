import { Branch } from "./branchTypes.type";
import { BaseEntity } from "./common.type";

// Inventory Item interface
export interface InventoryItem extends BaseEntity {
  quantity: number;
  item_name: string;
  sku: string;
  unit_price: string;
  reorder_level: string;
  category_id: string;
  branch_id: string 
  image?: string;
}

// Inventory Category interface
export interface InventoryCategory extends BaseEntity {
  category_name: string;
  description: string;
  tenant_id: string;
}

export interface BranchInventory extends BaseEntity {
  branch_id: string;
  item: InventoryItem;
  item_id: string;
  quantity: number;
  last_updated: string;
}

export interface TenantInventory extends BaseEntity {
  branch: Branch;
  branch_id: string;
  item: InventoryItem;
  item_id: string;
  quantity: number;
  last_updated: string;
}

export interface StockAdjustment extends BaseEntity {
  branch_id: string;
  item_id: string;
  quantity: number;
  reason: string;
  approved_by_id: string;
}


export interface StockTransfer extends BaseEntity {
  source_branch_id: string;
  destination_branch_id: string;
  item_id: string;
  quantity: number;
  status: 'Pending' | 'Completed' | 'Rejected'; // or simply `string` if dynamic
}
  
  // Optional: Types for inventory filters
  export type InventoryStatus = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  export type SortDirection = 'asc' | 'desc'
  export type SortField = keyof Omit<InventoryItem, 'id' | 'image' | 'description'>