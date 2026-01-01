'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessData, BusinessType } from '@/types/business';
import { Column, CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import PageHeader from '@/components/PageHeader';
import Form from '../Form';

const TypeData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessType>({
    api: `v1/super-admin/businessTypes/${id}`,
    queryKey: ['businessTypes', id],
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
  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    name: data?.businessType?.name || '',
  };
  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/super-admin/businessTypes/${id}`}
        title={data?.businessType?.name}
        backUrl="/manage-business/type"
        Form={<Form id={id} isEdit data={formData} />}
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        <CustomTable
          showFilters={false}
          data={data?.businesses ?? []}
          title={'Business'}
          columns={columns}
          onClickRow={(data) => {
            router.push(`/manage-business/business/${data.reference}`);
          }}
        />
      </div>
    </>
  );
};

export default TypeData;
