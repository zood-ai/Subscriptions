'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import PermissionsSelector from '../../PermissionsSelector';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  authorities: z
    .array(z.string())
    .min(1, 'Please select at least one permission'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  name: string;
  authorities: string[];
}

export default function RoleForm({
  id = '',
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
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
      name: data?.name ?? '',
      authorities: data?.authorities || [],
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit ? `v1/super-admin/roles/${id}` : 'v1/super-admin/roles',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['roles', id] : ['roles'],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/roles/${data.id}`);
        } else {
          router.push('/roles');
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
        <Input
          type="text"
          Label="Role Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        <Controller
          name="authorities"
          control={control}
          render={({ field }) => (
            <PermissionsSelector
              value={field.value}
              onChange={field.onChange}
              error={errors?.authorities?.message}
            />
          )}
        />
      </div>

      <FormSubmitButton isPending={isPending} btnText={btnText} error={error} />
    </form>
  );
}
