'use client';
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from '@/components/CustomTable';
import { PackageData } from '@/types/packages';
import { useRouter } from 'next/navigation';

const columns: Column<PackageData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'project', header: 'Project' },
  { key: 'period', header: 'Duration Period' },
  { key: 'created_at', header: 'Created at' },
];

const filters: FilterTab[] = [
  { label: 'All', value: 'all' },
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

export default function Table() {
  const router = useRouter();
  return (
    <div className="py-10 mainPaddingX">
      <CustomTable
        endPoint="v1/super-admin/business"
        columns={columns}
        filters={filters}
        actions={actions}
        onClickRow={(data) => {
          router.push(`/packages/${data.id}`);
        }}
        filterKey="project"
      />
    </div>
  );
}
