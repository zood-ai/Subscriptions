'use client';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/app/ReactQueryProvider';
import SingleSelect from '@/components/SingleSelect';
import { Controller } from 'react-hook-form';

const formSchema = z.object({
  business_reference: z
    .number()
    .int()
    .gte(100000, { message: 'Business reference must be 6 digits' })
    .lte(999999, { message: 'Business reference must be 6 digits' }),
  months: z.number(),
});

type FormData = z.infer<typeof formSchema>;

interface Response {
  id: string;
}

interface FormState {
  business_reference: number;
  months: number;
}

export default function Form({
  id = '',
  data,
}: {
  id?: string;
  data?: FormState;
}) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_reference: data?.business_reference,
      months: data?.months || 12,
    },
  });
  console.log({ errors });

  const { mutate, isPending, error } = useCustomMutation<FormData, Response>({
    api: 'v1/auth/extendBusiness',
    method: 'POST',
    options: {
      onSuccess: () => {
        if (id) {
          queryClient.invalidateQueries({
            queryKey: ['business', id],
          });
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
        <Controller
          name="months"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Subscription period"
              placeholder="Select business type"
              errorText={errors?.months?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(+value)}
              options={[
                { label: '3 Months', value: '3' },
                { label: '6 Months', value: '6' },
                { label: '12 Months', value: '12' },
              ]}
              required
              showSearch
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
          {isPending ? `Activing...` : 'Active'}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
