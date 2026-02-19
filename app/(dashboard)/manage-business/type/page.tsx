'use client';
import {
  CustomTable,
  type Column,
  type StatusFiltersTab,
  type ActionOption,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { BusinessType } from '@/types/business';
import Form from './Form';

const columns: Column<BusinessType['businessType']>[] = [
  { key: 'name', header: 'Name' },
  { key: 'created_at', header: 'Created at', type: 'date' },
];

const filters: StatusFiltersTab[] = [{ label: 'Deleted', value: 'true' }];

const actions: ActionOption[] = [
  {
    label: 'Delete',
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
  },
];

export default function BusinessTypes() {
  return (
    <>
      <PageHeader title="Business Type" Form={<Form />} />
      <div className="py-[40px] mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/businessTypes"
          statusFilterKey="isDeleted"
          statusFilters={filters}
          filters={{
            showName: true,
          }}
          columns={columns}
          actions={actions}
          onClickRow={(data) => `/manage-business/type/${data.id}`}
        />
      </div>
    </>
  );
}
