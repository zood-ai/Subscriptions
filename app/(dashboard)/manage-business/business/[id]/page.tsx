import { CustomTable, type Column } from '@/components/CustomTable';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import Query from '@/lib/Query';
import { redirect } from 'next/navigation';
import {
  customersColumns,
  devicesColumns,
  suppliersColumns,
  usersColumns,
} from './constants';
import { BusinessResponse } from '@/types/business';
import { Suspense } from 'react';
import Spinner from '@/components/ui/spinner';

interface Props {
  params: Promise<{ id: string }>;
}

interface TableFetchProps<T> {
  title: string;
  endPoint: string;
  columns: Column<T>[];
}

export default async function Business({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <BusinessFetch id={id} />
    </Suspense>
  );
}

const BusinessFetch = async ({ id }: { id: string }) => {
  const data = await Query<BusinessResponse>({
    api: `v1/super-admin/business/${id}`,
  });
  if (data.error) {
    redirect('/manage-business/business');
  }

  const items = [
    { title: 'Name', value: data?.data?.business.name },
    { title: 'Reference', value: data?.data?.business.reference },
    { title: 'Owner email', value: data?.data?.business.owner_email },
    { title: 'Created at', value: data?.data?.business.created_at },
    { title: 'End at', value: data?.data?.business.end_at },
  ];

  const tables = [
    {
      id: 'suppliers',
      title: 'Suppliers',
      endPoint: `/api/business/${id}/suppliers`,
      columns: suppliersColumns,
    },
    {
      id: 'devices',
      title: 'Devices',
      endPoint: `/api/business/${id}/devices`,
      columns: devicesColumns,
    },
    {
      id: 'users',
      title: 'Users',
      endPoint: `/api/business/${id}/users`,
      columns: usersColumns,
    },
    {
      id: 'customers',
      title: 'Customers',
      endPoint: `/api/business/${id}/customers`,
      columns: customersColumns,
    },
  ];
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
          {data?.data?.business.name}
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

const TableFetch = async <T extends { id: string }>({
  title,
  columns,
  endPoint,
}: TableFetchProps<T>) => {
  return <CustomTable endPoint={endPoint} title={title} columns={columns} />;
};
