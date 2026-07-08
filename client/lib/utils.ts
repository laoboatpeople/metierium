import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-CA').format(num);
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const difficultyColors = {
  EASY: 'text-accent-green bg-accent-green/10',
  MEDIUM: 'text-accent-amber bg-accent-amber/10',
  HARD: 'text-accent-red bg-accent-red/10',
};

export const statusColors = {
  PENDING: 'text-accent-amber bg-accent-amber/10',
  APPROVED: 'text-accent-green bg-accent-green/10',
  REJECTED: 'text-accent-red bg-accent-red/10',
};

export const roleColors = {
  ADMIN: 'text-accent-purple bg-accent-purple/10',
  INSTRUCTOR: 'text-accent-cyan bg-accent-cyan/10',
  STUDENT: 'text-accent-blue bg-accent-blue/10',
};
