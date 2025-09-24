export enum UserRole {
  // System roles
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  VIEWER = 'viewer',

  //Tenant Specific Roles
  TENANT_OWNER = 'tenant_owner',
  TENANT_USER = 'tenant_user',
  TENANT_ADMIN = 'tenant_admin',


  // Branch specific roles
  BRANCH_MANAGER = 'branch_manager',
  BRANCH_STAFF = 'branch_staff',

  // HR specific roles
  HR_ADMIN = 'hr_admin',
  HR_EMPLOYEE = 'hr_employee',
  EMPLOYEE = 'employee',

  // Inventory specific roles
  INVENTORY_MANAGER = 'inventory_manager',

  
  // Department specific roles
  ACCOUNTANT = 'accountant',
  CFO = 'cfo',
  HR_MANAGER = 'hr_manager',
  HR_SPECIALIST = 'hr_specialist',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  WAREHOUSE_WORKER = 'warehouse_worker',
  STORE_MANAGER = 'store_manager',
  CASHIER = 'cashier',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  PROCUREMENT_MANAGER = 'procurement_manager',
  PROCUREMENT_SPECIALIST = 'procurement_specialist',
  CUSTOMER_SERVICE = 'customer_service',
  
  // Import/Export specific
  CUSTOMS_SPECIALIST = 'customs_specialist',
  LOGISTICS_COORDINATOR = 'logistics_coordinator',
  TRADE_COMPLIANCE = 'trade_compliance'
}
// -------- User Status --------
export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending"
  | "locked";

// -------- Role --------
export interface Role {
  id: string;
  name: string; // could be mapped to UserRole enum if you want stricter typing
  description?: string;
}

// -------- Branch --------
export interface Branch {
  id: string;
  name: string;
  location?: string;
}

// -------- Department --------
export interface Department {
  id: string;
  name: string;
  code?: string;
}

// -------- Emergency Contact --------
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

// -------- Preferences --------
export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// -------- User (Backend/Frontend unified) --------
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  branchId?: string;
  branch?: Branch;
  departmentId?: string;
  department?: Department;
  position?: string;
  employeeId?: string;
  status: UserStatus;
  notes?: string;
  emergencyContact?: EmergencyContact;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

// -------- User Form Data (used in react-hook-form) --------
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: string[]; // in your form you’re using role.id (string), not enum
  branchId: string;
  department: string; // you’re storing department.name, not id — want me to switch this to departmentId?
  position: string;
  employeeId: string;
  status: UserStatus;
  notes: string;
  emergencyContact: EmergencyContact;
  preferences: UserPreferences;
}
