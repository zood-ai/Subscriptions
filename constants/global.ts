import { Input } from '@/components/ActionPopUp';

export const isBlockedInputs = (isBlocked: boolean): Input[] => {
  return isBlocked
    ? [
        {
          key: 'reason',
          label: 'Reason',
          value: '',
          type: 'text',
          isHidden: true,
        },
        {
          key: 'active',
          label: 'Active',
          value: '1',
          type: 'text',
          isHidden: true,
        },
      ]
    : [
        {
          key: 'reason',
          label: 'Reason',
          value: '',
          isRequired: true,
          type: 'text',
        },
        {
          key: 'active',
          label: 'Active',
          value: '0',
          type: 'text',
          isHidden: true,
        },
      ];
};

export const COLORS = [
  '#7272f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
];

export const businessStatusOptions = [
  { label: 'All Businesses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Expiring Soon', value: 'expiring_soon' },
];

export const deviceTypes = [
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

export const allLanguages = [
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

export const activationCodePeriods = [
  {
    label: '1 Month',
    value: '1',
  },
  {
    label: '3 Months',
    value: '3',
  },
  {
    label: '6 Months',
    value: '6',
  },
  {
    label: 'Year',
    value: '12',
  },
];

export const AllProjects = [
  { label: 'Zood Light', value: 'zood-light' },
  { label: 'Control', value: 'control' },
  { label: 'Accountant', value: 'accountant' },
];

export const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i.toString().padStart(2, '0')}:00`,
  value: `${i.toString().padStart(2, '0')}:00`,
}));

export const expiringSoonDays = 30 * 24 * 60 * 60 * 1000;

export const isBusinessExpired = (end_at: string) => {
  return new Date() > new Date(end_at as string);
};

export const isBusinessExpiringSoon = (end_at: string) => {
  return (
    !isBusinessExpired(end_at) &&
    new Date() >= new Date(new Date(end_at).getTime() - expiringSoonDays)
  );
};

export const isBusinessActive = (end_at: string) => {
  return !isBusinessExpired(end_at) && !isBusinessExpiringSoon(end_at);
};
