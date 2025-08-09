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

  federalTax?: number;
  stateTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;

  salaryExpenseAccountId: string;
  accruedPayrollLiabilityAccountId: string;
  taxesPayableAccountId: string;
  bankAccountId: string;

  status: PayrollStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollDto {
  employeeId: string;

  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;

  grossPay: number;
  netPay: number;

  federalTax?: number;
  stateTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;

  salaryExpenseAccountId: string;
  accruedPayrollLiabilityAccountId: string;
  taxesPayableAccountId: string;
  bankAccountId: string;
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
