'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessResponse } from '@/types/business';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import PageHeader from '@/components/PageHeader';
import Form from '../Form';

const BranchDetails = ({
  reference,
  id,
}: {
  reference: string;
  id: string;
}) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessResponse['branches']>({
    api: `v1/super-admin/business/${reference}/branches/${id}`,
    queryKey: ['branches', reference, id],
    options: {
      onError: () => {
        router.push(`/manage-business/business/${reference}`);
      },
    },
  });

  const items = [
    { title: 'Name', value: data?.name },
    { title: 'Name Localized', value: data?.name_localized },
    { title: 'Reference', value: data?.reference },
    { title: 'Opening From', value: data?.opening_from },
    { title: 'Opening To', value: data?.opening_to },
    { title: 'Inventory End of Day', value: data?.inventory_end_of_day_time },
    { title: 'Tax Group', value: data?.tax_group?.name || 'N/A' },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  return (
    <>
      <PageHeader
        deleteEndPoint={`v1/super-admin/business/${reference}/branches/${id}`}
        title={data?.name}
        backUrl={`/manage-business/business/${reference}`}
        isEdit
        Form={<Form isEdit reference={reference} id={id} data={data} />}
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
      </div>
    </>
  );
};

export default BranchDetails;
