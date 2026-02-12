'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
  type StatusFiltersTab,
} from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { BusinessData } from '@/types/business';
import Form from './Form';
import {
  activationCodePeriods,
  isBusinessExpired,
  isBusinessExpiringSoon,
} from '@/constants/global';

const columns: Column<BusinessData>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'end_at',
    header: 'is Active?',
    render: (_, item) => {
      return (
        <div className="text-nowrap">
          {isBusinessExpired(item.end_at as string) ? (
            <Badge variant="danger" label="Expired" />
          ) : isBusinessExpiringSoon(item.end_at as string) ? (
            <Badge variant="warning" label="Expiring Soon" />
          ) : (
            <Badge variant="success" label="Active" />
          )}
        </div>
      );
    },
  },
  {
    key: 'active',
    header: 'is Blocked?',
    render: (value) => (
      <div className="text-nowrap">
        {value === 0 ? (
          <Badge variant="danger" label="Blocked" />
        ) : (
          <Badge variant="success" label="No" />
        )}
      </div>
    ),
  },
  { key: 'reference', header: 'Reference' },
  { key: 'owner_email', header: 'Owner email' },
  { key: 'created_at', header: 'Created at', type: 'date' },
  { key: 'end_at', header: 'End at', type: 'date' },
];

const filters: StatusFiltersTab[] = [
  { label: 'Active', value: 'active' },
  { label: 'Expiring soon', value: 'expiring' },
  { label: 'Expired', value: 'expired' },
];

const actions: ActionOption[] = [
  {
    label: 'Delete',
    actionType: 'delete',
    method: 'DELETE',
    message: 'Are you sure you want to delete these?',
  },
  {
    label: 'Active',
    actionType: 'active',
    method: 'PUT',
    inputs: [
      {
        key: 'months',
        label: 'Subscription period',
        value: '12',
        options: activationCodePeriods,
        isRequired: true,
      },
    ],
  },
  {
    label: 'Block',
    actionType: 'block',
    method: 'PUT',
    inputs: [
      {
        key: 'reason',
        label: 'Reason',
        value: '',
        isRequired: true,
        type: 'text',
      },
      {
        key: 'active',
        label: 'Active',
        value: '0',
        type: 'text',
        isHidden: true,
      },
    ],
  },
  {
    label: 'UnBlock',
    actionType: 'unblock',
    method: 'PUT',
    message: 'Are you sure you want to unblock these?',
    inputs: [
      {
        key: 'reason',
        label: 'Reason',
        value: '',
        type: 'text',
        isHidden: true,
      },
      {
        key: 'active',
        label: 'Active',
        value: '1',
        type: 'text',
        isHidden: true,
      },
    ],
  },
];

export default function Businesses() {
  return (
    <>
      <PageHeader title="Business" Form={<Form />} />
      <div className="py-10 mainPaddingX">
        <CustomTable
          endPoint="v1/super-admin/business"
          columns={columns}
          statusFilters={filters}
          filters={{
            showName: true,
            showReference: true,
            showEndAT: true,
            showBusinessType: true,
          }}
          actions={actions}
          onClickRow={(data) => `/manage-business/business/${data.reference}`}
          statusFilterKey="status"
        />
      </div>
    </>
  );
}
