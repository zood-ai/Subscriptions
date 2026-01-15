'use client';
import { DetailCard, DetailItem } from '@/components/DetailCard';
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
import Form from '../Form';
import { formatDate } from '@/lib/utils';

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

  const items: DetailItem[] = [
    { title: 'Name', value: data?.business.name },
    { title: 'Reference', value: data?.business.reference },
    { title: 'Owner email', value: data?.business.owner_email },
    { title: 'Created at', value: formatDate(data?.business.created_at ?? '') },
    { title: 'End at', value: formatDate(data?.business.end_at ?? '') },
    { title: 'Block Reason', value: data?.business?.reason },
    { title: 'Owner name', value: data?.business.owner_name },
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
    name: data?.business.owner_name ?? '',
    email: data?.business.owner_email ?? '',
    phone: data?.business.phone ?? '',
    business_name: data?.business.name ?? '',
    business_type_id: data?.business.type ?? '',
    business_location_id:
      data?.business.location ?? '70c4bc20-1fe4-48b2-87c5-26407fe09cde',
  };
  const acitveFormData = {
    business_reference: data?.business.reference ?? 1,
    months: 12,
  };
  return (
    <>
      <PageHeader
        isEdit
        title={data?.business.name}
        Form={<Form id={id} isEdit data={formData} />}
        deleteEndPoint={`v1/super-admin/business/${id}`}
        businessActiveForm={<ActiveForm id={id} data={acitveFormData} />}
        blockEndPoint={`v1/super-admin/businessStatus/changeStatus/${id}`}
        isBlocked={data?.business.active === 0 ? true : false}
        backUrl="/manage-business/business"
      />
      <div className="py-10 mainPaddingX">
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
