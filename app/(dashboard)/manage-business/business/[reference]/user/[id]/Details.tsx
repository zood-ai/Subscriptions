'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessResponse } from '@/types/business';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import PageHeader from '@/components/PageHeader';
import Form from '../Form';

const Details = ({ reference, id }: { reference: string; id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessResponse['users']>({
    api: `v1/super-admin/business/${reference}/users/${id}`,
    queryKey: ['users', id],
    options: {
      onError: () => {
        router.push(`/manage-business/business/${reference}`);
      },
    },
  });

  const items = [
    { title: 'Name', value: data?.name },
    { title: 'Email', value: data?.email },
    { title: 'Phone', value: data?.phone },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  return (
    <>
      <PageHeader
        deleteEndPoint={`v1/super-admin/business/${reference}/users/${id}`}
        title={data?.name}
        backUrl={`/manage-business/business/${reference}`}
        isEdit
        Form={<Form isEdit reference={reference} id={id} />}
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
      </div>
    </>
  );
};

export default Details;
