'use client';
import { Input } from '@/components/ui/input';
import SingleSelect from '@/components/SingleSelect';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { activationCodePeriods } from '@/constants/global';

const formSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  duration: z.string().min(1, 'Duration Period is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function Form() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      duration: '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<FormData>({
    api: 'v1/activationcode/store',
    method: 'POST',
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['v1/activationcode/list'],
        });
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
          Label="Code"
          error={errors?.code?.message}
          value={formValues.code}
          {...register('code')}
          required
        />
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Duration Period"
              errorText={errors?.duration?.message}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={activationCodePeriods}
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
