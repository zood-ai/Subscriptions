'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateBusinessTypeResponse {
  id: string;
}

interface FormState {
  name: string;
}

export default function CreateForm({
  id = '',
  type = 'create',
  data,
}: {
  id?: string;
  type?: 'create' | 'update';
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
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateBusinessTypeResponse
  >({
    api:
      type === 'create'
        ? 'v1/super-admin/businessTypes'
        : `v1/super-admin/businessTypes/${id}`,
    method: type === 'create' ? 'POST' : 'PUT',
    options: {
      onSuccess: (data) => {
        if (data?.id) {
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
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-lg">
        <div className="ml-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
          >
            {isPending ? `${type}ing...` : type}
          </Button>
        </div>
        {error && <p className="text-red-600 font-bold">{error.message}</p>}
      </div>
    </form>
  );
}
