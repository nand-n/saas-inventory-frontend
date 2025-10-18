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




export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}


export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
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