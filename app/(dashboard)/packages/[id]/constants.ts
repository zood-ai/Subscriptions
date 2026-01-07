import { type Column } from '@/components/CustomTable';
import { BusinessData } from '@/types/business';

const usersColumns: Column<BusinessData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
];

export { usersColumns };
