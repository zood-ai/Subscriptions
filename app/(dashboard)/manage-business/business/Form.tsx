'use client';
import { Input } from '@/components/ui/input';
import Select from '@/components/Select';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Country } from '@/types/countries';
import PermissionsSelector from './PermissionsSelector';
import FormSubmitButton from '@/components/FormSubmitButton';

const baseSchema = {
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  business_name: z.string().min(1, 'Business name is required'),
  package_id: z.string().min(1, 'Package is required'),
  business_type_id: z.string().min(1, 'Business type is required'),
  business_location_id: z.string().min(1, 'Country is required'),
  project: z.string().min(1, 'Project is required'),
  permissions: z
    .array(z.string())
    .min(1, 'Please select at least one permission'),
  permissionsGroupKeys: z.array(z.string()),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
});

interface BusinessRegistration {
  email: string;
  business_reference: number;
  pin: number;
  password: string;
  device_code: number;
}

interface CustomerRegistrationResponse {
  message: string;
  data: {
    user?: BusinessRegistration;
  };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  password?: string;
  package_id: string;
  business_name: string;
  business_type_id: string;
  business_location_id: string;
  project?: string;
  permissions?: string[];
  permissionsGroupKeys?: string[];
}

export default function Form({
  id = '',
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormState;
}) {
  const schema = isEdit ? editSchema : createSchema;
  type FormData = z.infer<typeof schema>;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? '',
      phone: data?.phone ?? '',
      password: '',
      business_name: data?.business_name ?? '',
      package_id: data?.package_id ?? '',
      business_type_id: data?.business_type_id ?? '',
      business_location_id: data?.business_location_id ?? '',
      project: data?.project ?? '',
      permissions: data?.permissions ?? [],
      permissionsGroupKeys: data?.permissionsGroupKeys ?? [],
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CustomerRegistrationResponse
  >({
    api: isEdit ? `v1/super-admin/business/${id}` : 'v1/auth/Register',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['business', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit && data?.data?.user?.business_reference) {
          router.push(
            `/manage-business/business/${data.data.user.business_reference}`
          );
        }
      },
    },
  });

  console.log({
    groups: formValues.permissionsGroupKeys,
    permission: formValues.permissions,
  });

  const onSubmit = (data: FormData) => {
    if (isEdit && !data.password) delete data.password;
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Input
          type="text"
          Label="Owner Full Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        <Input
          type="email"
          Label="Email"
          error={errors?.email?.message}
          value={formValues.email}
          {...register('email')}
          required
        />

        <Input
          type="text"
          Label="Phone"
          error={errors?.phone?.message}
          value={formValues.phone}
          {...register('phone')}
          required
        />

        <Input
          Label="Password"
          type="password"
          error={errors?.password?.message}
          value={formValues.password}
          {...register('password')}
          required={!isEdit}
        />

        <div className="border-t border-gray-200" />

        <Input
          type="text"
          Label="Business Name"
          error={errors?.business_name?.message}
          value={formValues.business_name}
          {...register('business_name')}
          required
        />

        <Controller
          name="business_type_id"
          control={control}
          render={({ field }) => (
            <Select<{ id: string; name: string }>
              label="Business Type"
              placeholder="Select business type"
              errorText={errors?.business_type_id?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/super-admin/businessTypes"
              itemResponseDataKey="businessType"
              labelKey="name"
              valueKey="id"
              required
            />
          )}
        />

        <Controller
          name="package_id"
          control={control}
          render={({ field }) => (
            <Select<{ id: string; name: string; project: string }>
              label="Package"
              errorText={errors?.package_id?.message}
              value={String(field.value)}
              onChange={(value) => {
                field.onChange(value);
              }}
              onValueChange={(value) => {
                setValue('project', value?.item?.project ?? '');
                setValue('permissions', []);
                setValue('permissionsGroupKeys', []);
              }}
              endPoint="v1/super-admin/packages"
              labelKey="name"
              valueKey="id"
              required
            />
          )}
        />

        <Controller
          name="business_location_id"
          control={control}
          render={({ field }) => (
            <Select<Country>
              label="Country"
              placeholder="Select country"
              errorText={errors?.business_location_id?.message}
              value={formValues.business_location_id}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/manage/countries"
              labelKey="name_en"
              valueKey="id"
              itemResponseDataKey="data"
              required
            />
          )}
        />

        <div className="border-t border-gray-200" />

        <Controller
          name="permissionsGroupKeys"
          control={control}
          render={({ field: permissionsGroupKeysField }) => (
            <Controller
              name="permissions"
              control={control}
              render={({ field: permissionsField }) => (
                <PermissionsSelector
                  value={permissionsField.value}
                  onChange={permissionsField.onChange}
                  onChangeGroupKeys={permissionsGroupKeysField.onChange}
                  error={errors?.permissions?.message}
                  projectValue={formValues.project}
                  projectPlaceholder="Select package first"
                  projectError={errors?.project?.message}
                  projectDisabled={true}
                />
              )}
            />
          )}
        />
      </div>

      <FormSubmitButton isPending={isPending} btnText={'Apply'} error={error} />
    </form>
  );
}
