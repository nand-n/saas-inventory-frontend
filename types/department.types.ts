import { BaseEntity } from "./common.type";

export interface Department extends BaseEntity {
  name: string;
  code: string;
  description: string;
  location: string;
  budget: string | number; 
  isActive: boolean;
  branchId: string;
}
