'use client';
import {
  CustomTable,
  type Column,
  type StatusFiltersTab,
  type ActionOption,
} from '@/components/CustomTable';
import Form from './Form';
import PageHeader from '@/components/PageHeader';

interface ActivationCodeData {
  business_reference: string;
  code: string;
  created_at: string;
  duration: string;
  id: string;
  is_used: number;
  updated_at: string;
}

const columns: Column<ActivationCodeData>[] = [
  { key: 'code', header: 'Code' },
  { key: 'duration', header: 'Duration' },
  {
    key: 'is_used',
    header: 'Is Used',
    render: (value) => (
      <span
        className={`${value === 0 ? 'text-red-500' : 'text-green-500'} font-semibold`}
      >
        {value === 0 ? 'No' : 'Yes'}
      </span>
    ),
  },
  { key: 'created_at', header: 'Created At', type: 'date' },
];

const filters: StatusFiltersTab[] = [
  { label: 'Used', value: '1' },
  { label: 'Not Used', value: '0' },
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
    label: 'Active',
    onClick: (selectedIds) => {
      console.log('Activing items:', selectedIds);
      alert(`Activing ${selectedIds.length} items`);
    },
  },
  {
    label: 'DeActive',
    onClick: (selectedIds) => {
      console.log('DeActiveing items:', selectedIds);
      alert(`DeActiveing ${selectedIds.length} items`);
    },
  },
];

export default function ActivationCodes() {
  return (
    <>
      <PageHeader title="Code" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/activationcode/list"
          columns={columns}
          filters={{
            showName: true,
            showIsUsed: true,
          }}
          statusFilters={filters}
          actions={actions}
          statusFilterKey="is_used"
        />
      </div>
    </>
  );
}
