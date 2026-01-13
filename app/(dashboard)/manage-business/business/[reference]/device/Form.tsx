'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/app/ReactQueryProvider';
import SingleSelect from '@/components/SingleSelect';

const formSchema = z.object({
  type: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  reference: z.string().min(1, 'Reference is required'),
  branch: z.string().min(1, 'Branch is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateBusinessTypeResponse {
  id: string;
}

interface FormState {
  type?: string;
  name: string;
  reference: string;
  branch: string;
}

export default function Form({
  id = '',
  isEdit = false,
  data,
  reference,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormState;
  reference: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: data?.type || '',
      name: data?.name || '',
      reference: data?.reference || '',
      branch: data?.branch || '',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateBusinessTypeResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/devices/${id}`
      : `v1/super-admin/business/${reference}/devices`,
    method: isEdit ? 'PUT' : 'POST',
    options: {
      onSuccess: () => {
        if (id) {
          queryClient.invalidateQueries({
            queryKey: ['devices', reference, id],
          });
        }
      },
    },
  });

  const { mutate: generateReference, isPending: isGenerating } =
    useCustomMutation<void, { reference: string }>({
      api: 'v1/super-admin/businessTypes/generate-reference',
      method: 'POST',
      options: {
        onSuccess: (response) => {
          setValue('reference', response.reference);
        },
      },
    });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const handleGenerateReference = () => {
    generateReference();
  };

  const deviceTypes = [
    {
      value: '1',
      label: 'Cashier',
    },
    {
      value: '2',
      label: 'KDS',
    },
    {
      value: '4',
      label: 'Notifier',
    },
    {
      value: '5',
      label: 'Display',
    },
    {
      value: '6',
      label: 'Sub Cashier',
    },
    {
      value: '7',
      label: 'Dashboard',
    },
  ];

  const btnText = isEdit ? 'Update' : 'Create';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Type"
              errorText={errors?.type?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              options={deviceTypes}
            />
          )}
        />

        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        <div className="flex max-sm:flex-wrap gap-x-3 items-center">
          <Input
            className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
            type="text"
            Label="Reference"
            error={errors?.reference?.message}
            value={formValues.reference}
            {...register('reference')}
            required
          />
          {/* <Button
            variant="secondary"
            type="button"
            onClick={handleGenerateReference}
            disabled={isGenerating}
            className="w-full sm:w-[200px] h-[50px] mt-7"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button> */}
        </div>

        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label="Branch"
              required
              errorText={errors?.branch?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint={`v1/super-admin/business/${reference}/branches`}
              labelKey="name"
              valueKey="id"
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
          {isPending ? `${btnText}ing...` : btnText}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
