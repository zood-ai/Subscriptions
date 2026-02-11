'use client';
import {
  CustomTable,
  type Column,
  type StatusFiltersTab,
  type ActionOption,
} from '@/components/CustomTable';
import Form from './Form';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';

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
    render: (value) =>
      value === 0 ? (
        <Badge variant="danger" label="No" />
      ) : (
        <Badge variant="success" label="Yes" />
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
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
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
            showCode: true,
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
