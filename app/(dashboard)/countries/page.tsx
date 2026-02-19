'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
} from '@/components/CustomTable';
import { Country } from '@/types/countries';
import Form from './Form';
import PageHeader from '@/components/PageHeader';

const columns: Column<Country>[] = [
  {
    key: 'name_en',
    header: 'Name',
    render: (value, item) => {
      return <span>{item?.name || item.name_en}</span>;
    },
  },
  {
    key: 'created_at',
    header: 'Created At',
    type: 'date',
  },
];

const actions: ActionOption[] = [
  {
    label: 'Delete',
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
  },
];

export default function CountriesPage() {
  return (
    <>
      <PageHeader title="Country" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/manage/countries"
          columns={columns}
          filters={{
            showName: true,
          }}
          onClickRow={(row) => `/countries/${row.id}`}
          actions={actions}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
