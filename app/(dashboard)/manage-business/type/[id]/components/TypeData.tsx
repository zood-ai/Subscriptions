'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessData, BusinessType } from '@/types/business';
import { Column, CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/app/loading';

const TypeData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useCustomQuery<BusinessType>({
    api: `v1/super-admin/businessTypes/${id}`,
    queryKey: ['businessTypes'],
    options: {
      onError: () => {
        router.push('/manage-business/type');
      },
    },
  });

  const items = [
    { title: 'Name', value: data?.businessType?.name },
    { title: 'Created at', value: data?.businessType?.created_at },
  ];

  const columns: Column<BusinessData>[] = [
    { key: 'name', header: 'Name' },
    { key: 'reference', header: 'Reference' },
    { key: 'owner_email', header: 'Owner email' },
    { key: 'created_at', header: 'Created at' },
    { key: 'end_at', header: 'End at' },
  ];
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <div className="py-[15px] mainPaddingX bg-white">
        <Link
          href="/manage-business/type"
          className="text-gray-500 flex items-center gap-1 text-xs"
        >
          <ChevronLeft size={15} />
          Back
        </Link>
        <h1 className="text-gray-500 text-[24px] font-normal">
          {data?.businessType?.name}
        </h1>
      </div>
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        <CustomTable
          showFilters={false}
          data={data?.businesses ?? []}
          title={'Business'}
          columns={columns}
        />
      </div>
    </>
  );
};

export default TypeData;
