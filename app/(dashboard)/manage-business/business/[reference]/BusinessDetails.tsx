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

const BusinessDetails = ({ reference }: { reference: string }) => {
  const router = useRouter();
  const { data, isFetching } = useCustomQuery<BusinessResponse>({
    api: `v1/super-admin/business/${reference}`,
    queryKey: ['business', reference],
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
  ];

  const tables = [
    {
      type: 'supplier',
      title: 'Suppliers',
      endPoint: `v1/super-admin/business/${reference}/suppliers`,
      columns: suppliersColumns,
    },
    {
      type: 'device',
      title: 'Devices',
      endPoint: `v1/super-admin/business/${reference}/devices`,
      columns: devicesColumns,
    },
    {
      type: 'user',
      title: 'Users',
      endPoint: `v1/super-admin/business/${reference}/users`,
      columns: usersColumns,
    },
    {
      type: 'customer',
      title: 'Customers',
      endPoint: `v1/super-admin/business/${reference}/customers`,
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
        businessActiveForm={
          <ActiveForm reference={reference} data={formData} />
        }
        businessBlockEndPoint={`v1/super-admin/businessStatus/changeStatus/${reference}`}
        isBlocked={data?.business.active === 0 ? true : false}
        backUrl="/manage-business/business"
      />
      <div className="py-[40px] mainPaddingX">
        <DetailCard items={items} />
        {tables.map((el) => (
          <CustomTable
            key={el.type}
            title={el.title}
            endPoint={el.endPoint}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            columns={el.columns as Column<any>[]}
            onClickRow={(data) => {
              router.push(
                `/manage-business/business/${reference}/${el.type}/${data.id}`
              );
            }}
          />
        ))}
      </div>
    </>
  );
};

export default BusinessDetails;
