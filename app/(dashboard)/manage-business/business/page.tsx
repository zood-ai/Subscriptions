'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
  type StatusFiltersTab,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { BusinessData } from '@/types/business';
import { useRouter } from 'next/navigation';
import Form from './Form';
import { expiringSoonDays } from '@/constants/global';

const columns: Column<BusinessData>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'end_at',
    header: 'is Active?',
    render: (_, item) => {
      const now = new Date();
      const endAt = new Date(item.end_at);
      const expiringSoonAt = new Date(endAt.getTime() - expiringSoonDays);

      return (
        <div className="text-nowrap">
          {now > endAt ? (
            <Badge variant="danger" label="Expired" />
          ) : now >= expiringSoonAt ? (
            <Badge variant="warning" label="Expiring Soon" />
          ) : (
            <Badge variant="success" label="Active" />
          )}
        </div>
      );
    },
  },
  {
    key: 'active',
    header: 'is Blocked?',
    render: (value) => (
      <div className="text-nowrap">
        {value === 0 ? (
          <Badge variant="danger" label="Blocked" />
        ) : (
          <Badge variant="success" label="No" />
        )}
      </div>
    ),
  },
  { key: 'reference', header: 'Reference' },
  { key: 'owner_email', header: 'Owner email' },
  { key: 'created_at', header: 'Created at', type: 'date' },
  { key: 'end_at', header: 'End at', type: 'date' },
];

const filters: StatusFiltersTab[] = [
  { label: 'Active', value: 'active' },
  { label: 'Expiring soon', value: 'expiring' },
  { label: 'Expired', value: 'expired' },
];

const actions: ActionOption[] = [
  {
    label: 'Delete',
    onClick: (selectedIds) => {
      console.log('Deleting items:', selectedIds);
      alert(`Deleting ${selectedIds.length} items`);
    },
  },
];

export default function Businesses() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Business" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/business"
          columns={columns}
          statusFilters={filters}
          filters={{
            showName: true,
            showReference: true,
            showEndAT: true,
            showBusinessType: true,
          }}
          actions={actions}
          onClickRow={(data) => {
            router.push(`/manage-business/business/${data.reference}`);
          }}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
