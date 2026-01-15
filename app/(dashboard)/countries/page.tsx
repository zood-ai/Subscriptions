'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
} from '@/components/CustomTable';
import { useRouter } from 'next/navigation';
import { Country } from '@/types/countries';
import Form from '../activation-code/Form';
import PageHeader from '@/components/PageHeader';

const columns: Column<Country>[] = [
  { key: 'name_en', header: 'Name' },
  {
    key: 'created_at',
    header: 'Created At',
    type: 'date',
  },
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

export default function CountriesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Country" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/countries"
          columns={columns}
          filters={{
            showName: true,
          }}
          onClickRow={(row) => {
            router.push(`/countries/${row.id}`);
          }}
          actions={actions}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
