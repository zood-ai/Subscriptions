'use client';
import { Input } from '@/components/ui/input';
import Select from '@/components/Select';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { AllProjects } from '@/constants/global';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discreption: z.string().optional(),
  discount: z
    .number()
    .min(0, 'Discount is required')
    .max(100, 'Discount is at most 100'),
  duration: z
    .number()
    .min(1, 'Duration is required and at least 1')
    .max(12, 'Duration is required and at most 12'),
  price: z.number().min(1, 'Price must be bigger than 1'),
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
      duration: data?.duration ?? 1,
      price: data?.price ?? 1,
      project: data?.project || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    PackageResponse
  >({
    api: isEdit ? `v1/super-admin/packages/${id}` : 'v1/super-admin/packages',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['packages', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/packages/${data.id}`);
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({
      ...data,
      duration: data.duration * 30,
    });
  };

  const Durations = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      label: `${month} ${month === 1 ? 'Month' : 'Months'}`,
      value: `${month}`,
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Input
          type="text"
          Label="Full Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        <Textarea
          Label="Discreption"
          error={errors?.discreption?.message}
          value={formValues.discreption}
          {...register('discreption')}
        />

        <Input
          type="number"
          Label="Price"
          min={1}
          error={errors?.price?.message}
          value={formValues.price}
          {...register('price', { valueAsNumber: true })}
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
          name="duration"
          control={control}
          render={({ field }) => (
            <Select
              label="Duration"
              placeholder="Select Duration"
              errorText={errors?.duration?.message}
              value={String(formValues.duration)}
              onChange={(value) => field.onChange(Number(value))}
              options={Durations}
              required
            />
          )}
        />

        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <Select
              label="Project"
              placeholder="Select Project"
              errorText={errors?.project?.message}
              value={String(formValues.project)}
              onChange={(value) => field.onChange(value)}
              options={AllProjects}
              required
            />
          )}
        />
      </div>
      <FormSubmitButton isPending={isPending} btnText="Apply" error={error} />
    </form>
  );
}
