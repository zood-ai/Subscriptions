'use client';
import {
  CustomTable,
  type Column,
  type StatusFiltersTab,
  type ActionOption,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { PackageData } from '@/types/packages';
import Form from './Form';
import { AllProjects } from '@/constants/global';

const columns: Column<PackageData>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'project',
    header: 'Project',
    render: (value) => (
      <div>{AllProjects.find((el) => el.value === value)?.label}</div>
    ),
  },
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

const filters: StatusFiltersTab[] = AllProjects;

const actions: ActionOption[] = [
  {
    label: 'Delete',
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
  },
];

export default function Packages() {
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
