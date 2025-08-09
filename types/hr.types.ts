import { BaseEntity } from "./common.type";
import { Department } from "./department.types";

export enum UserRole {
    //ALL
    ALL = 'all',

  // System roles
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  
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


export interface Employee extends BaseEntity {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  alternatePhone?: string | null;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  position:string
  maritalStatus?: "single"| "married"| "divorced"| "widowed" | "separated";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  nationality: string;
  education?: string
  experience?: string;
  skills?: string[];
  languages?: string[];
  profilePicture?: string | null;
  nationalId: string;
  socialSecurityNumber: string;
  taxId: string;
  hireDate: string;
  jobTitle: string;
  status: 'active' | 'inactive' | 'terminated';
  employmentType: 'full_time' | 'part_time' | 'contractor' | 'intern';
  salary: number | null;
  hourlyRate?: number | null;
  weeklyHours?: number;
  bankAccount?: string;
  bankName?: string;
  bankRoutingNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    lifeInsurance: boolean;
    retirementPlan: boolean;
    paidTimeOff: number;
    sickLeave: number;
  };
  terminationDate?: string | null;
  department: Department;
  departmentId: string;
}