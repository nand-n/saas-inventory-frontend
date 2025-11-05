import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const  handleApiError = (error: any):string => {
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : 'An unexpected error occurred. Please try again.';

  console.log(error, errorMessage, 'errorMessage');
return errorMessage
};


type  ExtractAsyncFnArgs<Args extends Array<any>> = Args extends Array<infer PotentiaalArgTypes> ? PotentiaalArgTypes : []

type Result<ReturnType> = [ReturnType , null] | [null , Error]

export async function runAsync<Args extends Array<any>, ReturnType>(
  asyncFunction: (...args: ExtractAsyncFnArgs<Args>) => Promise<ReturnType>,
  ...args: ExtractAsyncFnArgs<Args>
): Promise<Result<ReturnType>> {
  try {
    const result = await asyncFunction(...args);
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error: new Error(String(error)) ];
  }
}




export function formatCurrency(
  amount: number | string,
  currency: string = 'ETB',
): string {
  // Handle case when amount is a string formatted like "1,234.56"
  const numericValue =
    typeof amount === 'string'
      ? parseFloat(amount.replace(/,/g, '')) // remove commas, then convert to number
      : amount;

  // Safeguard if conversion fails
  if (isNaN(numericValue)) {
    console.warn(`Invalid amount passed to formatCurrency: ${amount}`);
    return `${currency} 0.00`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}


export function formatDate(date?: string | null): string {
  if (!date) return "—"; // return a dash or empty string instead of crashing
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—"; // invalid date guard
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}


export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function exportToCSV(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvData = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    }).join(',')
  );
  
  return [headers.join(','), ...csvData].join('\n');
}



export function calculateTotalTaxes(payroll: {
  federalTax: number;
  stateTax: number;
  socialSecurityTax: number;
  medicareTax: number;
}): number {
  return (
    payroll.federalTax +
    payroll.stateTax +
    payroll.socialSecurityTax +
    payroll.medicareTax
  );
}

export function calculateTotalDeductions(payroll: {
  federalTax: number;
  stateTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  healthInsurance?: number;
  retirement401k?: number;
  otherDeductions?: number;
}): number {
  const totalTaxes = calculateTotalTaxes(payroll);
  const otherDeductions =
    (payroll.healthInsurance || 0) +
    (payroll.retirement401k || 0) +
    (payroll.otherDeductions || 0);
  
  return totalTaxes + otherDeductions;
}

export function calculateTotalAdjustments(adjustments?: Array<{
  direction: "addition" | "deduction";
  amount: number;
}>): { additions: number; deductions: number; net: number } {
  if (!adjustments || adjustments.length === 0) {
    return { additions: 0, deductions: 0, net: 0 };
  }
  
  const additions = adjustments
    .filter(adj => adj.direction === "addition")
    .reduce((sum, adj) => sum + adj.amount, 0);
  
  const deductions = adjustments
    .filter(adj => adj.direction === "deduction")
    .reduce((sum, adj) => sum + adj.amount, 0);
  
  return {
    additions,
    deductions,
    net: additions - deductions,
  };
}