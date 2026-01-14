'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/app/ReactQueryProvider';

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
    options: {
      onSuccess: () => {
        if (id) {
          queryClient.invalidateQueries({
            queryKey: ['customers', id],
          });
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

        <div className="space-y-2">
          {/* <label
            htmlFor="customerNotes"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Customer Notes
          </label>
          <Textarea
            la
            id="customerNotes"
            placeholder="Enter customer notes..."
            className="min-h-[120px] resize-none"
            value={formValues.customerNotes}
            {...register('customerNotes')}
          />
          {errors?.customerNotes?.message && (
            <p className="text-sm text-red-600">
              {errors.customerNotes.message}
            </p>
          )} */}
        </div>
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
