// types/dashboard.types.ts

export interface BusinessType {
  id: string;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  name_localized: string | null;
  business_count: number;
}

export interface Business {
  id: string;
  name: string;
  country_iso_code: string;
  owner_email: string;
  owner_id: string;
  location: string;
  reference: number;
  trial_ends_at: string | null;
  has_pending_invoice: number;
  has_dot_pay: number;
  is_blocked: number;
  licenses: string;
  plan: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  odoo_url: string | null;
  odoo_database: string | null;
  odoo_user: string | null;
  odoo_password: string | null;
  details: string;
  end_at: string;
  active: number;
  reason: string | null;
  users_count?: number;
  invoices_count?: number;
}

export interface DashboardStats {
  total_businesses: number;
  active_businesses: number;
  new_businesses: number;
  expiring_soon: number;
  expired_businesses: number;
  top_by_users: Business[];
  top_by_invoices: Business[];
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

export type TimeSeriesData = {
  date: string;
  active: number;
  new: number;
  expired: number;
};
