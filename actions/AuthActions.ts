'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import Mutation from '@/lib/Mutation';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password is required and at least 6 characters'),
});

interface LoginResponse {
  token: string;
}
interface LoginBody {
  email: string;
  password: string;
}

export const LoginAction = async (
  prevState: { errors?: Record<string, string>; success?: boolean },
  formData: FormData
): Promise<{ errors?: Record<string, string>; success?: boolean }> => {
  const values = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });

    return { errors };
  }

  const { data, error } = await Mutation<LoginBody, LoginResponse>({
    api: 'v1/super-admin/login',
    method: 'POST',
    body: parsed.data,
  });
  if (error) {
    return {
      errors: { form: error },
    };
  } else {
    if (!data)
      return {
        errors: { form: 'Something went wrong' },
      };
    const days = 1;
    const cookieStore = await cookies();
    cookieStore.set('token', data.token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * days,
    });
    redirect('/dashboard');
  }
};
