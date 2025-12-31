'use client';
import {
  CustomTable,
  type Column,
  type ActionOption,
} from '@/components/CustomTable';
import { BusinessType } from '@/types/business';
import { useRouter } from 'next/navigation';

const columns: Column<BusinessType['businessType']>[] = [
  { key: 'name', header: 'Name' },
  { key: 'created_at', header: 'Created at' },
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

export default function Table() {
  const router = useRouter();
  return (
    <div className="py-[40px] mainPaddingX">
      <CustomTable
        endPoint="/api/business-types"
        columns={columns}
        actions={actions}
        onClickRow={(data) => `/manage-business/type/${data.id}`}
      />
    </div>
  );
}
