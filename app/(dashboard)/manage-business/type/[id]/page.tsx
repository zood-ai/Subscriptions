import { DetailCard } from '@/components/DetailCard';
import Query from '@/lib/Query';
import { redirect } from 'next/navigation';
import { BusinessData, BusinessType } from '@/types/business';
import { Suspense } from 'react';
import Spinner from '@/components/ui/spinner';
import { Column, CustomTable } from '@/components/CustomTable';
import PageHeader from '@/components/PageHeader';
import CreateForm from '../components/CreateForm';

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
      <PageHeader
        title={data?.data?.businessType?.name}
        backUrl="/manage-business/type"
        Form={
          <CreateForm
            id={data?.data?.businessType?.id || ''}
            data={{ name: data?.data?.businessType?.name || '' }}
            type="update"
          />
        }
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        <CustomTable
          showFilters={false}
          data={data?.data?.businesses ?? []}
          title={'Business'}
          columns={columns}
        />
      </div>
    </div>
  );
};
