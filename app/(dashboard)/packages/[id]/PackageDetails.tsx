'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import { usersColumns } from './columns';
import PageHeader from '@/components/PageHeader';
import { PackageData } from '@/types/packages';
import Form from '../Form';

const PackageDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<PackageData>({
    api: `v1/super-admin/packages/${id}`,
    queryKey: ['packages', id],
    options: {
      onError: () => {
        router.push('/packages');
      },
    },
  });

  const items = [
    { title: 'Name', value: data?.name },
    { title: 'Discreption', value: data?.discreption },
    { title: 'Price', value: data?.price ?? 1 },
    { title: 'Discount', value: data?.discount ?? 0 },
    {
      title: 'Duration',
      value: `${data?.duration ? data?.duration / 30 : 0} month${
        (data?.duration ? data?.duration / 30 : 0) > 1 ? 's' : ''
      }`,
    },
    { title: 'Project', value: data?.project },
    { title: 'Created at', value: data?.created_at, type: 'date' },
  ];

  const tables = [
    {
      id: 'users',
      title: 'Users',
      endPoint: `v1/super-admin/packages/${id}/users`,
      columns: usersColumns,
    },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    name: data?.name || '',
    discreption: data?.discreption || '',
    price: data?.price ?? 1,
    discount: data?.discount ?? 0,
    duration: data?.duration ? data?.duration / 30 : 0,
    project: data?.project || '',
  };

  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/super-admin/packages/${id}`}
        Form={<Form id={id} isEdit data={formData} />}
        title={data?.name}
        backUrl="/packages"
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        {tables.map((el) => (
          <CustomTable
            key={el.id}
            title={el.title}
            endPoint={el.endPoint}
            columns={el.columns}
          />
        ))}
      </div>
    </>
  );
};

export default PackageDetails;
