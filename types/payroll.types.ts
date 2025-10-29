// @/types/payroll.types.ts

import { Employee } from './hr.types';

export type PayrollStatus = 'draft' | 'paid' | 'cancelled';

export interface Payroll {
  id: string;
  employeeId: string;
  employee: Employee;

  payPeriodStart: string; // ISO Date string
  payPeriodEnd: string;   // ISO Date string
  payDate: string;        // ISO Date string

  grossPay: number;
  netPay: number;

  hoursWorked?: number;
  salaryExpenseAccountId: string;
  accruedPayrollLiabilityAccountId: string;
  taxesPayableAccountId: string;
  bankAccountId: string;

  status: PayrollStatus;
  adjustments?: PayrollAdjustment[];


  createdAt: string;
  updatedAt: string;
}


export enum PayrollRunStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  COMPLETED = "completed",
  APPROVED = "approved",
  CANCELLED = "cancelled",
}

export interface PayrollRun {
  id: string;
  name: string;

  periodStart: string; // ISO date string (e.g., "2025-10-01")
  periodEnd: string;   // ISO date string
  payDate?: string;    // optional ISO date string

  status: PayrollRunStatus;

  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;

  metadata?: Record<string, any>;

  payrolls?: Payroll[];

  createdAt: string; // inherited from BaseModel
  updatedAt: string; // inherited from BaseModel
}


export interface CreatePayrollRunDto {
  name: string;

  periodStart: string; // ISO date string
  periodEnd: string;   // ISO date string
  payDate?: string;    // optional ISO date string

  status?: PayrollRunStatus;

  totalGrossPay?: number;
  totalNetPay?: number;
  totalDeductions?: number;

  metadata?: Record<string, any>;

  /**
   * Option 1: Provide full payroll objects (to create dynamically)
   */
  payrolls?: CreatePayrollDto[];

  /**
   * Option 2: Provide IDs of existing payrolls (to link to this run)
   */
  payrollIds?: string[];
}


export interface UpdatePayrollRunDto extends Partial<CreatePayrollRunDto> {
  id?: string;
}


export interface PayrollAdjustment {
  id: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdByUser: string | null;
  updatedBy: string | null;

  type: AdjustmentType; 
  direction: "addition" | "deduction";
  amount: number;
  reason: string | null;

  effectiveDate: string | null;
  isRecurring: boolean;
  policyCode: string | null;

  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy: string | null;
  approvalDate: string | null;
  processedByPayroll: string | null;

  debitAccountId: string;
  creditAccountId: string;

  employee: Employee;
  payroll: Payroll;
  metadata: Record<string, any> | null;
}

export interface UpdatePayrollDto {
  payPeriodStart?: string;
  payPeriodEnd?: string;
  payDate?: string;

  grossPay?: number;
  netPay?: number;

  federalTax?: number;
  stateTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;

  salaryExpenseAccountId?: string;
  accruedPayrollLiabilityAccountId?: string;
  taxesPayableAccountId?: string;
  bankAccountId?: string;

  status?: PayrollStatus;
}


export enum AdjustmentDirection {
  ADDITION = 'addition',
  DEDUCTION = 'deduction',
}

/**
 * ⚙️ Adjustment Type — defines the context or nature of the change
 */
export enum AdjustmentType {
  BONUS = 'bonus',
  ALLOWANCE = 'allowance',
  OVERTIME = 'overtime',
  COMMISSION = 'commission',
  REIMBURSEMENT = 'reimbursement',
  TAX = 'tax',
  FINE = 'fine',
  LOAN = 'loan',
  ADVANCE = 'advance',
  OTHER = 'other',
}
export interface CreatePayrollAdjustmentDto {
  employeeId: string;
  payrollId?: string;
  type: AdjustmentType;
  direction: AdjustmentDirection;
  amount: number;
  reason?: string;
  isRecurring?: boolean;
  effectiveDate?: string;
  policyCode?: string;
  debitAccountId: string;
  creditAccountId: string;
  metadata?: Record<string, any>;
}

export interface CreatePayrollDto {
  employeeId: string;

  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;

  hoursWorked?: number;
  overtimeHours?: number;
  grossPay: number;
  overtimePay?: number;
  bonusPay?: number;
  commissionPay?: number;

  federalTax?: number;
  stateTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;
  healthInsurance?: number;
  retirementContribution?: number;
  otherDeductions?: number;

  netPay: number;

  salaryExpenseAccountId: string;
  accruedPayrollLiabilityAccountId: string;
  taxesPayableAccountId: string;
  bankAccountId: string;

  notes?: string;
  deductionDetails?: Record<string, any>;

  // ✅ Optional payroll adjustments
  adjustments?: CreatePayrollAdjustmentDto[];
}