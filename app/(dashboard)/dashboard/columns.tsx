import { Column } from '@/components/CustomTable';
import { Badge } from '@/components/ui/badge';
import { BusinessData } from '@/types/business';

export const topUserColumns: Column<BusinessData>[] = [
  {
    key: 'name',
    header: 'Business',
    render: (_, item) => (
      <div>
        <p className="text-base">{item.name}</p>
        <p className="font-semibold text-xs">#{item.reference}</p>
      </div>
    ),
  },
  { key: 'owner_email', header: 'Owner' },
  {
    key: 'users_count',
    header: 'Users',
    render: (value) => <Badge label={String(value)} variant="info" />,
  },
];

export const topInvoicesColumns: Column<BusinessData>[] = [
  {
    key: 'name',
    header: 'Business',
    render: (_, item) => (
      <div>
        <p className="text-base">{item.name}</p>
        <p className="font-semibold text-xs">#{item.reference}</p>
      </div>
    ),
  },
  { key: 'owner_email', header: 'Owner' },
  {
    key: 'invoices_count',
    header: 'Invoices',
    render: (value) => <Badge label={String(value)} variant="success" />,
  },
];
