'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import Mutation from '@/lib/Mutation';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Password is required'),
});

interface CreateBusinessTypeResponse {
  id: string;
}
interface CreateBusinessTypeBody {
  name: string;
}

export const CreateBusinessType = async (
  prevState: { errors?: Record<string, string>; success?: boolean },
  formData: FormData
): Promise<{ errors?: Record<string, string>; success?: boolean }> => {
  const values = {
    name: formData.get('name'),
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

  const { data, error } = await Mutation<
    CreateBusinessTypeBody,
    CreateBusinessTypeResponse
  >({
    api: 'v1/super-admin/businessTypes',
    method: 'POST',
    body: parsed.data,
  });
  if (error) {
    return {
      errors: { form: error },
    };
  } else {
    if (!data) {
      return {
        errors: { form: 'Something went wrong' },
      };
    }
    redirect(`/manage-business/type/${data.id}`);
  }
};
