'use server';
import { z } from 'zod';
import Mutation from '@/lib/Mutation';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email format'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
  business_name: z.string().min(1, 'Business name is required'),
  business_type_id: z.string().min(1, 'Business type is required'),
  business_location_id: z.string().min(1, 'Business location is required'),
});

interface BusinessRegistrationRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  business_name: string;
  business_type_id: string;
  business_location_id: string
}

interface BusinessRegistration {
  email: string;
  business_reference: number;
  pin: number;
  password: string;
  device_code: number;
}

interface CustomerRegistrationResponse {
  message: string;
  data: {
    user?: BusinessRegistration;
  }
}

export const RegisterCustomerAction = async (
  prevState: { errors?: Record<string, string>; success?: boolean },
  formData: FormData,
): Promise<{ errors?: Record<string, string>; success?: boolean }> => {
  const values = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    business_name: formData.get('business_name'),
    business_type_id: formData.get('business_type_id'),
    business_location_id: formData.get('business_location_id'),
  };

  console.log({ values });
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



  const { data, error } = await Mutation<BusinessRegistrationRequest, CustomerRegistrationResponse>({
    api: 'v1/auth/Register',
    method: 'POST',
    body: parsed.data,
  });

  console.log({
    data: data?.data?.user?.business_reference
  })
  if (error) {
    return {
      errors: { form: error },
    };
  }

  if (!data) {
    return {
      errors: { form: 'Something went wrong' },
    };
  }


  redirect(`/manage-business/business/${data?.data?.user?.business_reference}`);
};
