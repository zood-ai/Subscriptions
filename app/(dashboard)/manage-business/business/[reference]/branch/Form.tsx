'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '@/components/Select';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { timeOptions } from '@/constants/global';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  name_localized: z.string().optional(),
  reference: z.string().min(1, 'Reference is required'),
  tax_group_id: z.string().optional(),
  tax_name: z.string().optional(),
  tax_number: z.string().optional(),
  phone: z.string().optional(),
  opening_from: z.string().optional(),
  opening_to: z.string().optional(),
  inventory_end_of_day_time: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  receipt_header: z.string().optional(),
  receipt_footer: z.string().optional(),
  receives_online_orders: z.boolean().optional(),
  auto_end_of_day: z.boolean().optional(),
  registered_address: z.object({
    streetName: z.string().min(1, 'Street name is required'),
    buildingNumber: z.string().min(1, 'Building number is required'),
    additionalNumber: z.string().min(1, 'Additional number is required'),
    city: z.string().min(1, 'City is required'),
    citySubdivisionName: z.string().min(1, 'City subdivision is required'),
    district: z.string().min(1, 'District is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    commercialRegesterationNumber: z
      .string()
      .min(1, 'Commercial registration is required'),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

export default function Form({
  id = '',
  isEdit = false,
  data,
  reference,
}: {
  id?: string;
  isEdit?: boolean;
  data?: Partial<FormData>;
  reference: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      name_localized: data?.name_localized || '',
      reference: data?.reference || '',
      tax_group_id: data?.tax_group_id || '',
      tax_name: data?.tax_name || '',
      tax_number: data?.tax_number || '',
      phone: data?.phone || '',
      opening_from: data?.opening_from || '09:00',
      opening_to: data?.opening_to || '18:00',
      inventory_end_of_day_time: data?.inventory_end_of_day_time || '23:59',
      address: data?.address || '',
      latitude: data?.latitude || '',
      longitude: data?.longitude || '',
      receipt_header: data?.receipt_header || '',
      receipt_footer: data?.receipt_footer || '',
      receives_online_orders: data?.receives_online_orders || false,
      auto_end_of_day: data?.auto_end_of_day || false,
      registered_address: {
        streetName: data?.registered_address?.streetName || '',
        buildingNumber: data?.registered_address?.buildingNumber || '',
        additionalNumber: data?.registered_address?.additionalNumber || '',
        city: data?.registered_address?.city || '',
        citySubdivisionName:
          data?.registered_address?.citySubdivisionName || '',
        district: data?.registered_address?.district || '',
        postalCode: data?.registered_address?.postalCode || '',
        commercialRegesterationNumber:
          data?.registered_address?.commercialRegesterationNumber || '',
      },
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/branches/${id}`
      : `v1/super-admin/business/${reference}/branches`,
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['branches', reference, id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(
            `/manage-business/business/${reference}/branch/${data.id}`
          );
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <Input
            type="text"
            Label="Name"
            error={errors?.name?.message}
            value={formValues.name}
            {...register('name')}
            required
          />

          <Input
            type="text"
            Label="Name (Localized)"
            error={errors?.name_localized?.message}
            value={formValues.name_localized}
            {...register('name_localized')}
          />

          <Input
            type="text"
            Label="Reference"
            error={errors?.reference?.message}
            value={formValues.reference}
            {...register('reference')}
            required
          />
        </div>

        {/* Tax Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tax Information</h3>

          <Controller
            name="tax_group_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Tax Group"
                errorText={errors?.tax_group_id?.message}
                value={String(field.value)}
                onChange={(value) => field.onChange(value)}
                endPoint={`v1/super-admin/business/${reference}/tax-groups`}
                labelKey="name"
                valueKey="id"
                placeholder="None"
              />
            )}
          />

          <Input
            type="text"
            Label="Branch Tax Registration"
            error={errors?.tax_name?.message}
            value={formValues.tax_name}
            {...register('tax_name')}
          />

          <Input
            type="text"
            Label="Branch Number"
            error={errors?.tax_number?.message}
            value={formValues.tax_number}
            {...register('tax_number')}
          />
        </div>

        {/* Contact & Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact & Operating Hours</h3>

          <Input
            type="tel"
            Label="Phone"
            error={errors?.phone?.message}
            value={formValues.phone}
            {...register('phone')}
          />

          <Controller
            name="opening_from"
            control={control}
            render={({ field }) => (
              <Select
                label="Opening From"
                errorText={errors?.opening_from?.message}
                value={String(field.value)}
                onChange={(value) => field.onChange(value)}
                options={timeOptions}
              />
            )}
          />

          <Controller
            name="opening_to"
            control={control}
            render={({ field }) => (
              <Select
                label="Opening To"
                errorText={errors?.opening_to?.message}
                value={String(field.value)}
                onChange={(value) => field.onChange(value)}
                options={timeOptions}
              />
            )}
          />

          <Controller
            name="inventory_end_of_day_time"
            control={control}
            render={({ field }) => (
              <Select
                label="Inventory End of Day"
                errorText={errors?.inventory_end_of_day_time?.message}
                value={String(field.value)}
                onChange={(value) => field.onChange(value)}
                options={timeOptions}
              />
            )}
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>

          <Textarea
            Label="Address"
            error={errors?.address?.message}
            value={formValues.address}
            {...register('address')}
          />

          <Input
            type="text"
            Label="Street Name"
            error={errors?.registered_address?.streetName?.message}
            value={formValues.registered_address?.streetName}
            {...register('registered_address.streetName')}
            required
          />

          <Input
            type="text"
            Label="Building Number"
            error={errors?.registered_address?.buildingNumber?.message}
            value={formValues.registered_address?.buildingNumber}
            {...register('registered_address.buildingNumber')}
            required
          />

          <Input
            type="text"
            Label="Additional Number"
            error={errors?.registered_address?.additionalNumber?.message}
            value={formValues.registered_address?.additionalNumber}
            {...register('registered_address.additionalNumber')}
            required
          />

          <Input
            type="text"
            Label="City"
            error={errors?.registered_address?.city?.message}
            value={formValues.registered_address?.city}
            {...register('registered_address.city')}
            required
          />

          <Input
            type="text"
            Label="City Subdivision Name"
            error={errors?.registered_address?.citySubdivisionName?.message}
            value={formValues.registered_address?.citySubdivisionName}
            {...register('registered_address.citySubdivisionName')}
            required
          />

          <Input
            type="text"
            Label="District"
            error={errors?.registered_address?.district?.message}
            value={formValues.registered_address?.district}
            {...register('registered_address.district')}
            required
          />

          <Input
            type="text"
            Label="Postal Code"
            error={errors?.registered_address?.postalCode?.message}
            value={formValues.registered_address?.postalCode}
            {...register('registered_address.postalCode')}
            required
          />

          <Input
            type="text"
            Label="Commercial Registration Number"
            error={
              errors?.registered_address?.commercialRegesterationNumber?.message
            }
            value={formValues.registered_address?.commercialRegesterationNumber}
            {...register('registered_address.commercialRegesterationNumber')}
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location Coordinates</h3>

          <Input
            type="number"
            step="any"
            Label="Latitude"
            error={errors?.latitude?.message}
            value={formValues.latitude}
            {...register('latitude')}
          />

          <Input
            type="number"
            step="any"
            Label="Longitude"
            error={errors?.longitude?.message}
            value={formValues.longitude}
            {...register('longitude')}
          />
        </div>

        {/* Receipt Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Receipt Settings</h3>

          <Textarea
            Label="Receipt Header"
            error={errors?.receipt_header?.message}
            value={formValues.receipt_header}
            {...register('receipt_header')}
          />

          <Textarea
            Label="Receipt Footer"
            error={errors?.receipt_footer?.message}
            value={formValues.receipt_footer}
            {...register('receipt_footer')}
          />
        </div>

        {/* Advanced Settings (only in edit mode) */}
        {isEdit && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Settings</h3>

            <Controller
              name="receives_online_orders"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receives_online_orders"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="receives_online_orders"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Receive Call Center Orders
                  </label>
                </div>
              )}
            />

            <Controller
              name="auto_end_of_day"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto_end_of_day"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="auto_end_of_day"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Auto End of Day
                  </label>
                </div>
              )}
            />
          </div>
        )}
      </div>

      <FormSubmitButton
        isPending={isPending}
        btnText={isEdit ? 'Update' : 'Create'}
        error={error}
      />
    </div>
  );
}
