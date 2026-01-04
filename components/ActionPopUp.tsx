'use client';
import { Button } from './ui/button';
import useCustomMutation, { HttpMethod } from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import {
  Controller,
  DefaultValues,
  Path,
  useForm,
  useWatch,
} from 'react-hook-form';
import { Input } from './ui/input';
import SingleSelect from './SingleSelect';

interface InputWithOption {
  type?: never;
  options: { label: string; value: string }[];
}

interface InputWithType {
  type: 'text';
  options?: never;
}
type Input = {
  key: string;
  label: string;
  value?: string;
} & (InputWithOption | InputWithType);

interface ActionPopUpWithInputs {
  message?: never;
  inputs: Input[];
}
interface ActionPopUpWithMessage {
  message: string;
  inputs?: never;
}

type ActionPopUpProps = {
  endPoint: string;
  method: HttpMethod;
  btnTitle: string;
  backUrl?: string;
} & (ActionPopUpWithInputs | ActionPopUpWithMessage);

type FormData = Record<string, string>;

const ActionPopUp = ({
  endPoint,
  method,
  btnTitle,
  backUrl,
  message,
  inputs = [],
}: ActionPopUpProps) => {
  const router = useRouter();
  const defaultValues = inputs.reduce<FormData>((acc, item) => {
    if (item.value !== undefined) {
      acc[item.key] = item.value;
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
                  <SingleSelect
                    label={el.label}
                    placeholder={el.label}
                    errorText={errors?.[el.key]?.message}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={el.options}
                    required
                  />
                )}
              />
            );
          }
          return (
            <Input
              className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
              type={el.type}
              key={el.key}
              Label={el.label}
              error={errors?.[el.key]?.message}
              value={formValues?.[el.key]}
              {...register(el.key)}
              required
            />
          );
        })}
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4">
        <Button
          type="submit"
          variant="danger"
          disabled={isPending}
          loading={isPending}
          className={`${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isPending ? btnTitle + 'ing...' : btnTitle}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
};

export default ActionPopUp;
