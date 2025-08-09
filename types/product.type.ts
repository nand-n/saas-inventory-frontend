import { BaseEntity } from "./common.type";
import { Supplier } from "./supplier.types";

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit_price: number;
  unit_cost: number;
  weight?: number | null;
  dimensions?: Dimensions | null;
  barcode?: string | null;
  isActive: boolean;
  supplier?: Supplier | null; 
  orderItems?: any[];   
}