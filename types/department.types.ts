import { Branch } from "./branchTypes.type";
import { BaseEntity } from "./common.type";
import { Employee, UserRole } from "./hr.types";

export interface Department extends BaseEntity {
  name: string;
  code: string;
  description?: string; // nullable
  location?: string;    // nullable
  budget?: number;      // matches entity decimal(15,2), use number in TS
  isActive: boolean;
  branchId: string;

  // Relations
  parentDepartment?: Department; 
  subDepartments?: Department[];
  employees?: Employee[];   // you can replace `any` with Employee interface
  manager?: Employee;       // replace with User interface if available
  branch?: Branch;        
}

export type DepartmentBulkActionType =
  | "activate"
  | "deactivate"
  | "delete"
  | "assignManager"
  | "assignBranch";

export interface DepartmentBulkAction {
  departmentIds: string[];
  action: DepartmentBulkActionType;
  value?: string;
}


export interface DepartmentFormData  {
  name: string;
  code: string;
  description: string;
  location: string;
  budget?: number | string; 
  isActive: boolean;
  parentDepartmentId: string;
  managerId: string;
  branchId: string;
};


export interface DepartmentFilters {
  search?: string;
  isActive?: boolean;
  branchId?: string;
  managerId?: string;
}
