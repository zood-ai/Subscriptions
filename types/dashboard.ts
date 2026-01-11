import { BusinessData } from './business';

export interface DashboardStats {
  total_businesses: number;
  active_businesses: number;
  new_businesses: number;
  expiring_soon: number;
  expired_businesses: number;
  top_by_users: BusinessData[];
  top_by_invoices: BusinessData[];
}

export interface DashboardFilters {
  start_date?: string;
  end_date?: string;
  business_type?: string;
  status?: 'active' | 'expired' | 'expiring_soon' | 'all';
}

export type ChartDataPoint = {
  name: string;
  value: number;
  color?: string;
};
