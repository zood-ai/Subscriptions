'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/app/ReactQueryProvider';
import SingleSelect from '@/components/SingleSelect';
import { useRouter } from 'next/navigation';
import { deviceTypes } from '@/constants/business';

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
    options: {
      onSuccess: (data) => {
        if (isEdit) {
          queryClient.invalidateQueries({
            queryKey: ['devices', reference, id],
          });
        } else {
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
            <SingleSelect
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

        <div className="flex max-sm:flex-wrap gap-x-3 items-center">
          <Input
            type="text"
            Label="Reference"
            error={errors?.reference?.message}
            value={formValues.reference}
            {...register('reference')}
            required
          />
        </div>

        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <SingleSelect
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
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
        >
          {isPending ? `${btnText}ing...` : btnText}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
