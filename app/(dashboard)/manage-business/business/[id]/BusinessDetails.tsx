'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessResponse } from '@/types/business';
import { Column, CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import {
  customersColumns,
  devicesColumns,
  suppliersColumns,
  usersColumns,
} from './constants';
import PageHeader from '@/components/PageHeader';
import ActiveForm from './ActiveForm';

const BusinessDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessResponse>({
    api: `v1/super-admin/business/${id}`,
    queryKey: ['business', id],
    options: {
      onError: () => {
        router.push('/manage-business/business');
      },
    },
  });

  const items = [
    { title: 'Name', value: data?.business.name },
    { title: 'Reference', value: data?.business.reference },
    { title: 'Owner email', value: data?.business.owner_email },
    { title: 'Created at', value: data?.business.created_at },
    { title: 'End at', value: data?.business.end_at },
    { title: 'Block Reason', value: data?.business?.reason },
  ];

  const tables = [
    {
      id: 'suppliers',
      title: 'Suppliers',
      endPoint: `v1/super-admin/business/${id}/suppliers`,
      columns: suppliersColumns,
    },
    {
      id: 'devices',
      title: 'Devices',
      endPoint: `v1/super-admin/business/${id}/devices`,
      columns: devicesColumns,
    },
    {
      id: 'users',
      title: 'Users',
      endPoint: `v1/super-admin/business/${id}/users`,
      columns: usersColumns,
    },
    {
      id: 'customers',
      title: 'Customers',
      endPoint: `v1/super-admin/business/${id}/customers`,
      columns: customersColumns,
    },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const formData = {
    business_reference: data?.business.reference ?? 1,
    months: 12,
  };
  return (
    <>
      <PageHeader
        isEdit
        title={data?.business.name}
        businessActiveForm={<ActiveForm id={id} data={formData} />}
        businessBlockEndPoint={`v1/super-admin/businessStatus/changeStatus/${id}`}
        isBlocked={data?.business.active === 0 ? true : false}
        backUrl="/manage-business/business"
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        {tables.map((el) => (
          <CustomTable
            key={el.id}
            title={el.title}
            endPoint={el.endPoint}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            columns={el.columns as Column<any>[]}
          />
        ))}
      </div>
    </>
  );
};

export default BusinessDetails;
