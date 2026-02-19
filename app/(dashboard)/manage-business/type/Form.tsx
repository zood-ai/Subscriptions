'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Select from '@/components/Select';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().min(1, 'Business Category is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

export default function Form({
  id = '',
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormData;
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
      category_id: data?.category_id ?? '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/businessTypes/${id}`
      : 'v1/super-admin/businessTypes',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['businessTypes', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/manage-business/type/${data.id}`);
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

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select<{
              id: string;
              name: string;
            }>
              label="Category"
              placeholder="Select category"
              errorText={errors?.category_id?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/super-admin/categories"
              labelKey="name"
              valueKey="id"
              required
            />
          )}
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
