import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import Query from '@/lib/Query';
import { redirect } from 'next/navigation';
import { BusinessData, BusinessType } from '@/types/business';
import { Suspense } from 'react';
import Spinner from '@/components/ui/spinner';
import { Column, CustomTable } from '@/components/CustomTable';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Type({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <TypeFetch id={id} />
    </Suspense>
  );
}

const TypeFetch = async ({ id }: { id: string }) => {
  const data = await Query<BusinessType>({
    api: `v1/super-admin/businessTypes/${id}`,
  });
  if (data.error) {
    redirect('/manage-business/type');
  }
  console.log({ data });

  const items = [
    { title: 'Name', value: data?.data?.businessType?.name },
    { title: 'Created at', value: data?.data?.businessType?.created_at },
  ];

  const columns: Column<BusinessData>[] = [
    { key: 'name', header: 'Name' },
    { key: 'reference', header: 'Reference' },
    { key: 'owner_email', header: 'Owner email' },
    { key: 'created_at', header: 'Created at' },
    { key: 'end_at', header: 'End at' },
  ];

  return (
    <div>
      <div className="py-[15px] mainPaddingX bg-white">
        <Link
          href="/manage-business/type"
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">
          {data?.data?.businessType?.name}
        </h1>
      </div>
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        <CustomTable
          data={data?.data?.businesses ?? []}
          title={'Business'}
          columns={columns}
        />
      </div>
    </div>
  );
};
