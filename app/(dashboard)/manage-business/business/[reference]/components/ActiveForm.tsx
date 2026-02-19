'use client';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '@/components/Select';
import { Controller } from 'react-hook-form';
import { activationCodePeriods } from '@/constants/global';
import FormSubmitButton from '@/components/FormSubmitButton';

const formSchema = z.object({
  business_reference: z.number().int(),
  months: z.number(),
});

type FormData = z.infer<typeof formSchema>;

interface FormState {
  business_reference: number;
  months: number;
}

export default function Form({
  reference = '',
  data,
}: {
  reference?: string;
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

  const { mutate, isPending, error } = useCustomMutation<FormData>({
    api: 'v1/auth/extendBusiness',
    method: 'POST',
    invalidateQueryKeys: reference ? ['business', reference] : [],
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
            <Select
              label="Subscription period"
              placeholder="Select business type"
              errorText={errors?.months?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(+value)}
              options={activationCodePeriods}
              required
            />
          )}
        />
      </div>
      <FormSubmitButton isPending={isPending} btnText="Active" error={error} />
    </form>
  );
}
