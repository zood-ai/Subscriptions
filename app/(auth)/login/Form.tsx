'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password is required and at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface LoginResponse {
  token: string;
}

export default function Form() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formValues = useWatch({
    control,
  });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    LoginResponse
  >({
    api: 'v1/super-admin/login',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        Cookies.set('token', data.token);
        router.push('/dashboard');
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[25px]">
      <Input
        Label="Email"
        animateLabel
        type="email"
        error={errors?.email?.message}
        value={formValues.email}
        {...register('email')}
      />

      <Input
        Label="Password"
        type="password"
        animateLabel
        value={formValues.password}
        error={errors?.password?.message}
        {...register('password')}
      />

      {error && <div className="text-red-500 text-sm">{error.message}</div>}

      <div className="flex justify-end pt-5">
        <Button loading={isPending} type="submit" variant="primary">
          {isPending ? 'Loading...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
