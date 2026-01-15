'use client';
import { DetailCard, DetailItem } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { Country } from '@/types/countries';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import PageHeader from '@/components/PageHeader';
import Form from '../Form';
import { formatDate } from '@/lib/utils';

const CountryData = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<Country>({
    api: `v1/super-admin/countries/${id}`,
    queryKey: ['countries', id],
    options: {
      onError: () => {
        router.push('/countries');
      },
    },
  });

  const items: DetailItem[] = [
    { title: 'Name', value: data?.name_en },
    {
      title: 'Created at',
      value: formatDate(data?.created_at ?? ''),
    },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    name: data?.name_en || '',
  };
  return (
    <>
      <PageHeader
        isEdit
        deleteEndPoint={`v1/super-admin/countries/${id}`}
        title={data?.name_en}
        backUrl="/countries"
        Form={<Form id={id} isEdit data={formData} />}
      />
      <div className="py-10 mainPaddingX">
        <DetailCard items={items} />
      </div>
    </>
  );
};

export default CountryData;
