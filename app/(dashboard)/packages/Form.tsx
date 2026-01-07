'use client';
import { Input } from '@/components/ui/input';
import SingleSelect from '@/components/SingleSelect';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discreption: z.string().min(1, 'Discreption is required'),
  discount: z
    .number()
    .min(0, 'Discount is required')
    .max(100, 'Discount is at most 100'),
  period: z
    .number()
    .min(1, 'Period is required and at least 1')
    .max(12, 'Period is required and at most 12'),
  project: z.string().min(1, 'Project is required'),
});

type FormData = z.infer<typeof formSchema>;

interface PackageResponse {
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
      discreption: data?.discreption || '',
      discount: data?.discount ?? 0,
      period: data?.period ?? 1,
      project: data?.project || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    PackageResponse
  >({
    api: isEdit
      ? `v1/super-admin/businessTypes/${id}`
      : 'v1/super-admin/businessTypes',
    method: isEdit ? 'PUT' : 'POST',
    options: {
      onSuccess: (data) => {
        if (data?.id) {
          router.push(`/packages/${data.id}`);
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const Periods = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      label: `${month} ${month === 1 ? 'Month' : 'Months'}`,
      value: `${month}`,
    };
  });

  const Projects = [
    { label: 'Zood Light', value: 'zood-light' },
    { label: 'Accountant', value: 'accountant' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        {/* Full Name */}
        <Input
          type="text"
          Label="Full Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        {/* Email */}
        <Textarea
          Label="Discreption"
          error={errors?.discreption?.message}
          value={formValues.discreption}
          {...register('discreption')}
          required
        />

        <Input
          type="number"
          Label="Discount %"
          min={0}
          max={100}
          error={errors?.discount?.message}
          value={formValues.discount}
          {...register('discount', { valueAsNumber: true })}
          required
        />

        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Period"
              placeholder="Select Period"
              errorText={errors?.period?.message}
              value={String(formValues.period)}
              onChange={(value) => field.onChange(Number(value))}
              options={Periods}
              required
            />
          )}
        />

        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Project"
              placeholder="Select Project"
              errorText={errors?.project?.message}
              value={String(formValues.project)}
              onChange={(value) => field.onChange(value)}
              options={Projects}
              required
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
          {isPending ? 'Applying...' : 'Apply'}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
