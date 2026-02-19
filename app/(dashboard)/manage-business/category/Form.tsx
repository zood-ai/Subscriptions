'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CategoryResponseData } from '@/types/categories';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Category Name is required'),
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
    CategoryResponseData
  >({
    api: isEdit ? `v1/manage/categories/${id}` : 'v1/manage/categories',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['categories', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/categories/${data.data.id}`);
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
          Label="Category Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />
        <Input
          type="text"
          Label="Category Name (EN)"
          error={errors?.name_en?.message}
          value={formValues.name_en}
          {...register('name_en')}
        />
      </div>
      <FormSubmitButton isPending={isPending} btnText="Apply" error={error} />
    </form>
  );
}
