'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone Number is required'),
  email: z.string().optional(),
  customerNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  name: string;
  phoneNumber: string;
  email?: string;
  customerNotes?: string;
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
      phoneNumber: data?.phoneNumber || '',
      email: data?.email || '',
      customerNotes: data?.customerNotes || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/customers/${id}`
      : `v1/super-admin/business/${reference}/customers`,
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['customers', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(
            `/manage-business/business/${reference}/customer/${data.id}`
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
          type="tel"
          Label="Phone Number"
          error={errors?.phoneNumber?.message}
          value={formValues.phoneNumber}
          {...register('phoneNumber')}
          required
        />

        <Input
          type="email"
          Label="Email"
          error={errors?.email?.message}
          value={formValues.email}
          {...register('email')}
        />

        <Textarea
          Label="Customer Notes"
          error={errors?.customerNotes?.message}
          value={formValues.customerNotes}
          {...register('customerNotes')}
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
