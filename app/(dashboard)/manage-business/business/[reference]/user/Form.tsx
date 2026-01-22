'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import useCustomMutation from '@/lib/Mutation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '@/components/Select';
import { useRouter } from 'next/navigation';
import { allLanguages } from '@/constants/global';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  language: z.string().min(1, 'Language is required'),
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  loginPin: z.string().min(1, 'Login Pin is required'),
  displayLocalizeName: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  name: string;
  language: string;
  email: string;
  password: string;
  loginPin: string;
  displayLocalizeName: boolean;
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
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      language: data?.language || '',
      email: data?.email || '',
      password: data?.password || '',
      loginPin: data?.loginPin || '',
      displayLocalizeName: data?.displayLocalizeName || false,
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `v1/super-admin/business/${reference}/users`
      : `v1/super-admin/business/${reference}/users/${id}`,
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['users', id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/manage-business/business/${reference}/user/${data.id}`);
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

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              label="Language"
              errorText={errors?.language?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              options={allLanguages}
              required
            />
          )}
        />

        <Input
          type="email"
          Label="Email"
          error={errors?.email?.message}
          value={formValues.email}
          {...register('email')}
          required
        />

        <Input
          type="password"
          Label="Password"
          error={errors?.password?.message}
          value={formValues.password}
          {...register('password')}
          required
        />

        <Input
          type="text"
          Label="Login Pin"
          error={errors?.loginPin?.message}
          value={formValues.loginPin}
          {...register('loginPin')}
          required
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="displayLocalizeName"
            checked={formValues.displayLocalizeName}
            onCheckedChange={(checked) =>
              setValue('displayLocalizeName', checked as boolean)
            }
          />
          <label
            htmlFor="displayLocalizeName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Display Localize Name
          </label>
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
