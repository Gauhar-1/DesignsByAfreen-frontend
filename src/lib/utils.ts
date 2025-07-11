import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

 export const  formatDate = (isoDate : Date | string) => {
  const date = new Date(isoDate);
  return date.toLocaleString();  // Local date and time
}