'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CountryResponseData } from '@/types/countries';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Country Name is required'),
  name_en: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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
      name_en: data?.name_en || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CountryResponseData
  >({
    api: isEdit ? `v1/manage/countries/${id}` : 'v1/manage/countries',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['countries', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/countries/${data.data.id}`);
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
          Label="Country Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />
        <Input
          type="text"
          Label="Country Name (EN)"
          error={errors?.name_en?.message}
          value={formValues.name_en}
          {...register('name_en')}
        />
      </div>
      <FormSubmitButton isPending={isPending} btnText="Apply" error={error} />
    </form>
  );
}
