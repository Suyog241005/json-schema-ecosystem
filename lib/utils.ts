import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Phase 2 Helper Functions

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((part / total) * 100).toFixed(2));
}

export function calculateDateDifference(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDateNWeeksAgo(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - (n * 7));
  return date;
}

export function getDateNMonthsAgo(n: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function sortByValue<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'desc' ? 1 : -1;
    if (a[key] > b[key]) return order === 'desc' ? -1 : 1;
    return 0;
  });
}
