'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '@/components/Select';
import { useRouter } from 'next/navigation';
import { deviceTypes } from '@/constants/global';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  type: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  reference: z.string().min(1, 'Reference is required'),
  branch: z.string().min(1, 'Branch is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  type?: string;
  name: string;
  reference: string;
  branch: string;
}

export default function Form({
  id = '',
  isEdit = false,
  data,
  reference,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormState;
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
      type: data?.type || '',
      name: data?.name || '',
      reference: data?.reference || '',
      branch: data?.branch || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/devices/${id}`
      : `v1/super-admin/business/${reference}/devices`,
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['devices', reference, id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(
            `/manage-business/business/${reference}/device/${data.id}`
          );
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const btnText = isEdit ? 'Update' : 'Create';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              errorText={errors?.type?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              options={deviceTypes}
            />
          )}
        />

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
          Label="Reference"
          error={errors?.reference?.message}
          value={formValues.reference}
          {...register('reference')}
          required
        />

        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <Select
              label="Branch"
              required
              errorText={errors?.branch?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint={`v1/super-admin/business/${reference}/branches`}
              labelKey="name"
              valueKey="id"
            />
          )}
        />
      </div>
      <FormSubmitButton isPending={isPending} btnText={btnText} error={error} />
    </form>
  );
}
