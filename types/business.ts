export interface businessSuppliersData {
  id: string;
  name: string;
  phone: string;
  primary_email: string;
}

export interface businessDevicesData {
  id: string;
  name: string;
  code: string;
  reference: string;
}

export interface businessUsersData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface businessCustomersData {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BusinessData {
  id: string;
  name: string;
  reference: number;
  owner_email: string;
  created_at: string;
  active: number;
  reason: string | null;
  end_at: string;
}

export interface BusinessResponse {
  business: BusinessData;
  suppliers: businessSuppliersData;
  devices: businessDevicesData;
  users: businessUsersData;
  customers: businessCustomersData;
}

export interface BusinessType {
  businessType: {
    id: string;
    name: string;
    created_at: string;
  };
  businesses: BusinessData[];
}
