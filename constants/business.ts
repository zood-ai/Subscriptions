import { type Column } from '@/components/CustomTable';
import {
  businessCustomersData,
  businessDevicesData,
  businessSuppliersData,
  businessUsersData,
} from '@/types/business';

const suppliersColumns: Column<businessSuppliersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'primary_email', header: 'Primary email' },
];

const devicesColumns: Column<businessDevicesData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'reference', header: 'Reference' },
];

const usersColumns: Column<businessUsersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
];

const customersColumns: Column<businessCustomersData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'notes', header: 'Notes' },
];

const deviceTypes = [
  {
    value: '1',
    label: 'Cashier',
  },
  {
    value: '2',
    label: 'KDS',
  },
  {
    value: '4',
    label: 'Notifier',
  },
  {
    value: '5',
    label: 'Display',
  },
  {
    value: '6',
    label: 'Sub Cashier',
  },
  {
    value: '7',
    label: 'Dashboard',
  },
];

const allLanguages = [
  {
    value: 'ar',
    label: 'Arabic',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'es',
    label: 'Espanol',
  },
  {
    value: 'fr',
    label: 'Francais',
  },
];

export {
  allLanguages,
  deviceTypes,
  suppliersColumns,
  devicesColumns,
  usersColumns,
  customersColumns,
};
