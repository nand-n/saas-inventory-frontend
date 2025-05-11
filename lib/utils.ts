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
