'use client';
import {
  CustomTable,
  type Column,
  type StatusFiltersTab,
  type ActionOption,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { PackageData } from '@/types/packages';
import { useRouter } from 'next/navigation';
import Form from './Form';

const columns: Column<PackageData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'project', header: 'Project' },
  {
    key: 'duration',
    header: 'Duration',
    render: (value) => (
      <div>
        {Number(value) / 30} {Number(value) / 30 > 1 ? 'Months' : 'Month'}
      </div>
    ),
  },
  { key: 'price', header: 'Price' },
  { key: 'created_at', header: 'Created at', type: 'date' },
];

const filters: StatusFiltersTab[] = [
  { label: 'Zood Light', value: 'zood-light' },
  { label: 'Accountant', value: 'accountant' },
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

export default function Packages() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Packages" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/packages"
          columns={columns}
          filters={{
            showName: true,
          }}
          statusFilters={filters}
          actions={actions}
          onClickRow={(data) => `/packages/${data.id}`}
          statusFilterKey="project"
        />
      </div>
    </>
  );
}
