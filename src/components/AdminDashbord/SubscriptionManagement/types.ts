import { ReactNode } from 'react';

export interface KpiData {
  title: string;
  value: string;
  icon: ReactNode;
}

export interface Plan {
  id: number;
  title: string;
  description: string;
  price: number;
  period: string;
  activeUsers: number;
  features: string[];
}
