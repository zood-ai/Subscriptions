'use client';
import { DetailCard } from '@/components/DetailCard';
import { useRouter } from 'next/navigation';
import { BusinessResponse } from '@/types/business';
import { Column, CustomTable } from '@/components/CustomTable';
import useCustomQuery from '@/lib/Query';
import LoadingComponent from '@/components/layout/loading';
import {
  branchesColumns,
  customersColumns,
  devicesColumns,
  suppliersColumns,
  usersColumns,
  rolesColumns,
} from './columns';
import PageHeader from '@/components/PageHeader';
import ActiveForm from './ActiveForm';
import BranchForm from '../branch/Form';
import SupplierForm from '../supplier/Form';
import CustomerForm from '../customer/Form';
import UserForm from '../user/Form';
import DeviceForm from '../device/Form';
import RoleForm from '../role/Form';
import { formatDate } from '@/lib/utils';
import Form from '../../Form';
import {
  isBusinessActive,
  isBusinessExpired,
  isBusinessExpiringSoon,
} from '@/constants/global';

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
    { title: 'Created at', value: formatDate(data?.business.created_at ?? '') },
    { title: 'End at', value: formatDate(data?.business.end_at ?? '') },
    {
      title: 'Block reason',
      value: data?.business.reason,
      isHidden: !!data?.business.active,
    },
  ];

  const tables = [
    {
      type: 'branch',
      title: 'Branches',
      endPoint: `v1/super-admin/business/${reference}/branches`,
      columns: branchesColumns,
      form: <BranchForm reference={reference} />,
    },
    {
      type: 'roles',
      title: 'Roles',
      endPoint: `v1/super-admin/business/${reference}/roles`,
      columns: rolesColumns,
      form: <RoleForm />,
    },
    {
      type: 'supplier',
      title: 'Suppliers',
      endPoint: `v1/super-admin/business/${reference}/suppliers`,
      exportEndPoint: `v1/export/suppliers`,
      importEndPoint: `v1/super-admin/business/${reference}/branches`,
      columns: suppliersColumns,
      form: <SupplierForm reference={reference} />,
    },
    {
      type: 'device',
      title: 'Devices',
      endPoint: `v1/super-admin/business/${reference}/devices`,
      exportEndPoint: `v1/super-admin/business/${reference}/branches`,
      importEndPoint: `v1/super-admin/business/${reference}/branches`,
      columns: devicesColumns,
      form: <DeviceForm reference={reference} />,
    },
    {
      type: 'user',
      title: 'Users',
      endPoint: `v1/super-admin/business/${reference}/users`,
      exportEndPoint: `v1/super-admin/business/${reference}/branches`,
      importEndPoint: `v1/super-admin/business/${reference}/branches`,
      columns: usersColumns,
      form: <UserForm reference={reference} />,
    },
    {
      type: 'customer',
      title: 'Customers',
      endPoint: `v1/super-admin/business/${reference}/customers`,
      exportEndPoint: `v1/super-admin/business/${reference}/branches`,
      importEndPoint: `v1/super-admin/business/${reference}/branches`,
      columns: customersColumns,
      form: <CustomerForm reference={reference} />,
    },
  ];

  if (isFetching) {
    return <LoadingComponent />;
  }

  const aciveFormData = {
    business_reference: data?.business.reference ?? 1,
    months: 12,
  };

  const formData = {
    name: data?.business?.owner_name ?? '',
    email: data?.business?.owner_email ?? '',
    phone: data?.business?.phone ?? '',
    password: '',
    business_name: data?.business?.name ?? '',
    package_id: JSON.parse(data?.business?.details ?? '{}').package_id ?? '',
    business_type_id: data?.business?.type ?? '',
    business_location_id: data?.business?.location ?? '',
    permissions: JSON.parse(data?.business?.permissions ?? '{}') ?? [],
    permissionsGroupKeys: data?.business?.permissionsGroupKeys ?? [],
    project: JSON.parse(data?.business?.details ?? '{}').project ?? '',
  };

  return (
    <>
      <PageHeader
        isEdit
        Form={<Form isEdit id={reference} data={formData} />}
        title={data?.business.name}
        businessActiveForm={
          <ActiveForm reference={reference} data={aciveFormData} />
        }
        deleteEndPoint={`v1/super-admin/business/${reference}`}
        blockEndPoint={`v1/super-admin/businessStatus/changeStatus/${reference}`}
        isBlocked={data?.business.active === 0 ? true : false}
        badges={[
          {
            label: 'Blocked',
            variant: 'danger',
            visible: data?.business.active === 0 ? true : false,
          },
          {
            label: 'Active',
            variant: 'success',
            visible: isBusinessActive(data?.business?.end_at as string),
          },
          {
            label: 'Expired',
            variant: 'danger',
            visible: isBusinessExpired(data?.business?.end_at as string),
          },
          {
            label: 'Expiring Soon',
            variant: 'warning',
            visible: isBusinessExpiringSoon(data?.business?.end_at as string),
          },
        ]}
        backUrl="/manage-business/business"
      />
      <div className="py-10 mainPaddingX">
        <DetailCard items={items} />
        <div className="space-y-[25px] pt-[25px]">
          {tables.map((el) => (
            <>
              <PageHeader
                Form={el.form}
                className="p-0 px-0! bg-[#FAFAFA]"
                title={el.title}
              />
              <CustomTable
                key={el.type}
                endPoint={el.endPoint}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={el.columns as Column<any>[]}
                filters={{
                  showName: true,
                }}
                showExport={!!el.exportEndPoint}
                showImport={!!el.importEndPoint}
                exportEndPoint={el.exportEndPoint}
                importEndPoint={el.importEndPoint}
                onClickRow={(data) =>
                  `/manage-business/business/${reference}/${el.type}/${data.id}`
                }
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default BusinessDetails;
