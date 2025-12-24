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
  taxGroup: string;
  createdAt: string;
}

const sampleData: BranchData[] = [
  {
    id: '1',
    name: 'Abdelrahman',
    reference: '52251',
    taxGroup: 'VAT',
    createdAt: 'November 30, 03:17am',
  },
  {
    id: '2',
    name: 'فرع الشفا',
    reference: '88442',
    taxGroup: 'VAT',
    createdAt: 'July 24, 04:29am',
  },
  {
    id: '3',
    name: 'فرع السويدي',
    reference: '16640',
    taxGroup: 'VAT',
    createdAt: 'July 24, 04:29am',
  },
  {
    id: '4',
    name: 'فرع لين',
    reference: '92326',
    taxGroup: 'VAT',
    createdAt: 'July 24, 04:29am',
  },
  {
    id: '5',
    name: 'فرع الهفهوف',
    reference: '76449',
    taxGroup: 'VAT',
    createdAt: 'July 24, 04:27am',
  },
];

const columns: Column<BranchData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'reference', header: 'Reference' },
  { key: 'taxGroup', header: 'Tax Group' },
  { key: 'createdAt', header: 'Created at' },
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
    <div className="pt-[40px] px-[60px]">
      <CustomTable
        data={sampleData}
        columns={columns}
        filters={filters}
        actions={actions}
        onClickRow={(data) => {
          console.log(data);
          router.push(`/manage-business/business/${data.name}`);
        }}
        onFilterChange={(filter) => console.log('Filter changed to:', filter)}
        onSelectionChange={(ids) => console.log('Selection changed:', ids)}
      />
    </div>
  );
}
