import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DetailCard } from '@/components/DetailCard';
import Query from '@/lib/Query';
import { redirect } from 'next/navigation';
import { BusinessType } from '@/types/business';
import { Suspense } from 'react';
import Spinner from '@/components/ui/spinner';

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
      <BusinessFetch id={id} />
    </Suspense>
  );
}

const BusinessFetch = async ({ id }: { id: string }) => {
  const data = await Query<BusinessType>({
    api: `v1/super-admin/businessTypes/${id}`,
  });
  if (data.error) {
    redirect('/manage-business/type');
  }

  const items = [
    { title: 'Name', value: data?.data?.name },
    { title: 'Created at', value: data?.data?.created_at },
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
          {data?.data?.name}
        </h1>
      </div>
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
      </div>
    </div>
  );
};
