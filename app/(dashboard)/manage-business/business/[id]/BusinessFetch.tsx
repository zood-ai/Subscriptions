'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessResponse } from '@/types/business';
import { Column, CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import {
  customersColumns,
  devicesColumns,
  suppliersColumns,
  usersColumns,
} from './constants';

interface TableFetchProps<T> {
  title: string;
  endPoint: string;
  columns: Column<T>[];
}

const BusinessFetch = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useCustomQuery<BusinessResponse>({
    api: `v1/super-admin/business/${id}`,
    queryKey: ['business', id],
    options: {
      onError: () => {
        router.push('/manage-business/business');
      },
    },
  });
  const items = [
    { title: 'Name', value: data?.business.name },
    { title: 'Reference', value: data?.business.reference },
    { title: 'Owner email', value: data?.business.owner_email },
    { title: 'Created at', value: data?.business.created_at },
    { title: 'End at', value: data?.business.end_at },
  ];

  const tables = [
    {
      id: 'suppliers',
      title: 'Suppliers',
      endPoint: `v1/super-admin/business/${id}/suppliers`,
      columns: suppliersColumns,
    },
    {
      id: 'devices',
      title: 'Devices',
      endPoint: `v1/super-admin/business/${id}/devices`,
      columns: devicesColumns,
    },
    {
      id: 'users',
      title: 'Users',
      endPoint: `v1/super-admin/business/${id}/users`,
      columns: usersColumns,
    },
    {
      id: 'customers',
      title: 'Customers',
      endPoint: `v1/super-admin/business/${id}/customers`,
      columns: customersColumns,
    },
  ];

  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <div className="py-[15px] mainPaddingX bg-white">
        <Link
          href="/manage-business/business"
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">
          {data?.business.name}
        </h1>
      </div>
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        {tables.map((el) => (
          <TableFetch
            key={el.id}
            title={el.title}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            columns={el.columns as any}
            endPoint={el.endPoint}
          />
        ))}
      </div>
    </>
  );
};

const TableFetch = <T extends { id: string }>({
  title,
  columns,
  endPoint,
}: TableFetchProps<T>) => {
  return <CustomTable endPoint={endPoint} title={title} columns={columns} />;
};

export default BusinessFetch;
