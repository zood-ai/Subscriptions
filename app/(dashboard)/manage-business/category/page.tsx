'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
} from '@/components/CustomTable';
import { Category } from '@/types/categories';
import Form from './Form';
import PageHeader from '@/components/PageHeader';

const columns: Column<Category>[] = [
  {
    key: 'name',
    header: 'Name',
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

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title="Category" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/categories"
          columns={columns}
          filters={{
            showName: true,
          }}
          onClickRow={(row) => `/manage-business/category/${row.id}`}
          actions={actions}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
