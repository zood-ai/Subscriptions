export interface BusinessSuppliersData {
  id: string;
  name: string;
  phone: string;
  primary_email: string;
}

export interface BusinessDevicesData {
  id: string;
  name: string;
  code: string;
  reference: string;
}

export interface BusinessUsersData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface BusinessCustomersData {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BusinessRolesData {
  id: string;
  name: string;
  users: number;
}

export interface BusinessData {
  id: string;
  name: string;
  country_iso_code: string;
  owner_email: string;
  owner_name: string;
  owner_id: string;
  location: string;
  reference: number;
  trial_ends_at: string | null;
  has_pending_invoice: number;
  has_dot_pay: number;
  is_blocked: number;
  licenses: string;
  package_id: string | null;
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
  phone: string;
  users_count?: number;
  invoices_count?: number;
}

export interface BusinessBranchesData {
  id: string;
  name: string;
  name_localized?: string;
  reference: string;
  tax_group_id?: string;
  tax_group?: {
    id: string;
    name: string;
  };
  tax_name?: string;
  tax_number?: string;
  phone?: string;
  opening_from?: string;
  opening_to?: string;
  inventory_end_of_day_time?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  image?: string;
  receipt_header?: string;
  receipt_footer?: string;
  receives_online_orders?: boolean;
  auto_end_of_day?: boolean;
  registered_address?: {
    streetName: string;
    buildingNumber: string;
    additionalNumber: string;
    city: string;
    citySubdivisionName: string;
    district: string;
    postalCode: string;
    commercialRegesterationNumber: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface BusinessResponse {
  business: BusinessData;
  suppliers: BusinessSuppliersData;
  devices: BusinessDevicesData;
  users: BusinessUsersData;
  customers: BusinessCustomersData;
  branches: BusinessBranchesData;
}

export interface BusinessType {
  businessType: {
    id: string;
    name: string;
    category_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    name_localized: string | null;
    business_count: number;
  };
  businesses: BusinessData[];
}
