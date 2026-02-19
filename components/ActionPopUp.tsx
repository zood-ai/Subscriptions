'use client';
import { Button } from './ui/button';
import useCustomMutation, { HttpMethod } from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { Controller, DefaultValues, useForm, useWatch } from 'react-hook-form';
import { Input } from './ui/input';
import Select, { Option } from './Select';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import FormSubmitButton from './FormSubmitButton';

interface InputWithOption {
  type?: never;
  value?: string;
  options: Option[];
}

interface InputWithType {
  type: 'text' | 'array';
  value?: string | string[];
  options?: never;
}

export type Input = {
  key: string;
  label: string;
  isHidden?: boolean;
  isRequired?: boolean;
} & (InputWithOption | InputWithType);

type ActionPopUpProps = {
  endPoint: string;
  method: HttpMethod;
  btnTitle: string;
  backUrl?: string;
  message?: string;
  inputs?: Input[];
  invalidateQueryKeys?: QueryKey;
};

type FormData = Record<string, string | string[]>;

const ActionPopUp = ({
  endPoint,
  method,
  btnTitle,
  backUrl,
  message,
  inputs = [],
  invalidateQueryKeys = [],
}: ActionPopUpProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const defaultValues = inputs.reduce<FormData>((acc, item) => {
    if (item.value !== undefined) {
      acc[item.key] = item.value ?? '';
    }
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues: defaultValues as DefaultValues<FormData>,
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<FormData, void>({
    api: endPoint,
    method,
    options: {
      onSuccess: () => {
        if (backUrl) router.push(backUrl);
        queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {message && (
        <div className="space-y-4">
          <p className="text-gray-600">{message}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {inputs.map((el) => {
          if (el.options) {
            return (
              <Controller
                name={el.key}
                key={el.key}
                control={control}
                render={({ field }) => (
                  <Select
                    label={el.label}
                    placeholder={el.label}
                    errorText={errors?.[el.key]?.message}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={el.options}
                    isHidden={el.isHidden}
                    required
                  />
                )}
              />
            );
          }
          return (
            <Input
              type={el.type}
              key={el.key}
              Label={el.label}
              error={errors?.[el.key]?.message}
              value={formValues?.[el.key]}
              {...register(el.key)}
              isHidden={el.isHidden}
              required={el.isRequired}
            />
          );
        })}
      </div>
      <FormSubmitButton
        buttonType="submit"
        buttonVariant={method === 'DELETE' ? 'danger' : 'primary'}
        buttonClassName={`${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        isPending={isPending}
        btnText={btnTitle}
        error={error}
      />
    </form>
  );
};

export default ActionPopUp;
