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

  federalTax?: number;
  stateTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;

  salaryExpenseAccountId: string;
  accruedPayrollLiabilityAccountId: string;
  taxesPayableAccountId: string;
  bankAccountId: string;

  status: PayrollStatus;
  adjestments: CreatePayrollAdjustmentDto[];


  createdAt: string;
  updatedAt: string;
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