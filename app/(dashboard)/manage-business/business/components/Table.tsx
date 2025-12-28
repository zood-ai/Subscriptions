'use client';
import {
  CustomTable,
  type Column,
  type FilterTab,
  type ActionOption,
} from '@/components/CustomTable';
import { useRouter } from 'next/navigation';

interface BranchData {
  id: string;
  name: string;
  reference: string;
  owner_email: string;
  created_at: string;
  end_at: string;
}

const columns: Column<BranchData>[] = [
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
  {
    label: 'Export',
    onClick: (selectedIds) => {
      console.log('Exporting items:', selectedIds);
      alert(`Exporting ${selectedIds.length} items`);
    },
  },
  {
    label: 'Archive',
    onClick: (selectedIds) => {
      console.log('Archiving items:', selectedIds);
      alert(`Archiving ${selectedIds.length} items`);
    },
  },
];

export default function Table() {
  const router = useRouter();
  return (
    <div className="py-[40px] mainPaddingX">
      <CustomTable
        endPoint="/api/business"
        columns={columns}
        filters={filters}
        actions={actions}
        onClickRow={(data) => {
          router.push(`/manage-business/business/${data.id}`);
        }}
        filterKey="status"
      />
    </div>
  );
}
