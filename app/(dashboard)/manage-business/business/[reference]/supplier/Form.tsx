'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  supplierCode: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  primaryEmail: z.string().optional(),
  additionalEmail: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  name: string;
  supplierCode?: string;
  contactName?: string;
  phone?: string;
  primaryEmail?: string;
  additionalEmail?: string;
}

export default function Form({
  id = '',
  isEdit = false,
  reference,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  reference: string;
  data?: FormState;
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
      supplierCode: data?.supplierCode || '',
      contactName: data?.contactName || '',
      phone: data?.phone || '',
      primaryEmail: data?.primaryEmail || '',
      additionalEmail: data?.additionalEmail || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/suppliers/${id}`
      : `v1/super-admin/business/${reference}/suppliers`,
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['suppliers', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(
            `/manage-business/business/${reference}/supplier/${data.id}`
          );
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
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
          Label="Supplier Code"
          error={errors?.supplierCode?.message}
          value={formValues.supplierCode}
          {...register('supplierCode')}
        />

        <Input
          type="text"
          Label="Contact Name"
          error={errors?.contactName?.message}
          value={formValues.contactName}
          {...register('contactName')}
        />

        <Input
          type="tel"
          Label="Phone"
          error={errors?.phone?.message}
          value={formValues.phone}
          {...register('phone')}
        />

        <Input
          type="email"
          Label="Primary Email"
          error={errors?.primaryEmail?.message}
          value={formValues.primaryEmail}
          {...register('primaryEmail')}
        />

        <Input
          type="email"
          Label="Additional Email"
          error={errors?.additionalEmail?.message}
          value={formValues.additionalEmail}
          {...register('additionalEmail')}
        />
      </div>

      <FormSubmitButton
        isPending={isPending}
        btnText={isEdit ? 'Update' : 'Create'}
        error={error}
      />
    </form>
  );
}
