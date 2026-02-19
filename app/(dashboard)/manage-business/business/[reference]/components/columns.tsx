import { type Column } from '@/components/CustomTable';
import {
  BusinessCustomersData,
  BusinessDevicesData,
  BusinessSuppliersData,
  BusinessUsersData,
  BusinessBranchesData,
  BusinessRolesData,
} from '@/types/business';

const suppliersColumns: Column<BusinessSuppliersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'primary_email', header: 'Primary email' },
];

const devicesColumns: Column<BusinessDevicesData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'reference', header: 'Reference' },
];

const usersColumns: Column<BusinessUsersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
];

const customersColumns: Column<BusinessCustomersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'notes', header: 'Notes' },
];

const branchesColumns: Column<BusinessBranchesData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
  {
    key: 'tax_group',
    header: 'Tax Group',
    render: (_, item) => item.tax_group?.name || 'N/A',
  },
  { key: 'created_at', header: 'Created At', type: 'date' },
];

const rolesColumns: Column<BusinessRolesData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'users', header: 'Users count' },
];

export {
  suppliersColumns,
  devicesColumns,
  usersColumns,
  customersColumns,
  branchesColumns,
  rolesColumns,
};
