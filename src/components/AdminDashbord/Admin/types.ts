import { ReactNode } from 'react';
import { Plan as ApiPlan } from '../../../redux/features/subscriptions/subscriptions.types';

export interface KpiData {
  title: string;
  value: string;
  icon: ReactNode;
}

// Extended interface for admin display
export interface AdminPlan extends Omit<ApiPlan, 'id' | 'alias'> {
  id: number; // For UI purposes
  alias: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string | null;
  isActive: boolean;
  features: string[];
  activeUsers?: number;
  isPopular?: boolean;
}