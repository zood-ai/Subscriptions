'use client';
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from '@/components/CustomTable';
import { BusinessData } from '@/types/business';
import { useRouter } from 'next/navigation';

const columns: Column<BusinessData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
  { key: 'owner_email', header: 'Owner email' },
  { key: 'created_at', header: 'Created at' },
  { key: 'end_at', header: 'End at' },
];

const filters: FilterTab[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
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

export default function Table() {
  const router = useRouter();
  return (
    <div className="py-[40px] mainPaddingX">
      <CustomTable
        endPoint="v1/super-admin/business"
        columns={columns}
        filters={filters}
        actions={actions}
        onClickRow={(data) => {
          router.push(`/manage-business/business/${data.reference}`);
        }}
        filterKey="status"
      />
    </div>
  );
}
