'use client';
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { BusinessType } from '@/types/business';
import { useRouter } from 'next/navigation';
import Form from './Form';

const columns: Column<BusinessType['businessType']>[] = [
  { key: 'name', header: 'Name' },
  { key: 'created_at', header: 'Created at' },
];

const filters: FilterTab[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'true' },
  { label: 'Deleted', value: 'false' },
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

export default function BusinessTypes() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Business Types" Form={<Form />} />
      <div className="py-[40px] mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/businessTypes"
          filterKey="isDeleted"
          filters={filters}
          columns={columns}
          actions={actions}
          onClickRow={(data) => {
            router.push(`/manage-business/type/${data.id}`);
          }}
        />
      </div>
    </>
  );
}
