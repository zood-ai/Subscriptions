'use client';
import { Input } from '@/components/ui/input';
import SingleSelect from '@/components/SingleSelect';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
  business_name: z.string().min(1, 'Business name is required'),
  business_type_id: z.string().min(1, 'Business type is required'),
  business_location_id: z.string().min(1, 'Country is required'),
});

type FormData = z.infer<typeof formSchema>;

interface BusinessTypes {
  id: string;
  name: string;
}

interface Countries {
  id: string;
  name_en: string;
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
  };
}

export default function CreateForm() {
  const router = useRouter();
  const countries: Countries[] = [];
  const businessTypes: BusinessTypes[] = [];
  const [tradeRegister, setTradeRegister] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      business_name: '',
      business_type_id: 'asd',
      business_location_id: '70c4bc20-1fe4-48b2-87c5-26407fe09cde',
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CustomerRegistrationResponse
  >({
    api: 'v1/auth/Register',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        if (data?.data?.user?.business_reference) {
          router.push(
            `/manage-business/business/${data.data.user.business_reference}`
          );
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        {/* Full Name */}
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Full Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        {/* Email */}
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="email"
          Label="Email"
          error={errors?.email?.message}
          value={formValues.email}
          {...register('email')}
          required
        />

        {/* Phone */}
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Phone"
          error={errors?.phone?.message}
          value={formValues.phone}
          {...register('phone')}
          required
        />

        {/* Password */}
        <Input
          Label="Password"
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="password"
          error={errors?.password?.message}
          value={formValues.password}
          {...register('password')}
          required
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Business Name */}
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Business Name"
          error={errors?.business_name?.message}
          value={formValues.business_name}
          {...register('business_name')}
          required
        />

        {/* Business Type */}
        <SingleSelect
          label="Business Type"
          name="business_type_id"
          className="placeholder:text-opacity-50"
          placeholder="Select business type"
          errorText={errors?.business_type_id?.message}
          value={formValues.business_type_id}
          onChange={(value) => {
            const event = {
              target: { name: 'business_type_id', value },
            } as React.ChangeEvent<HTMLInputElement>;
            register('business_type_id').onChange(event);
          }}
          options={businessTypes?.map(
            (business: { id: string; name: string }) => ({
              label: business.name,
              value: business.id,
            })
          )}
          loading={false}
          required
          showSearch
        />

        {/* Country */}
        <SingleSelect
          label="Country"
          name="business_location_id"
          className="placeholder:text-opacity-50"
          placeholder="Select country"
          errorText={errors?.business_location_id?.message}
          value={formValues.business_location_id}
          onChange={(value) => {
            const event = {
              target: { name: 'business_location_id', value },
            } as React.ChangeEvent<HTMLInputElement>;
            register('business_location_id').onChange(event);
          }}
          options={countries?.map(
            (country: { id: string; name_en: string }) => ({
              label: country.name_en,
              value: country.id,
            })
          )}
          loading={false}
          required
          showSearch
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Trade Register Upload */}
        <label className="text-base font-semibold text-gray-700 mb-3 block">
          Upload Trade Register
        </label>
        <div className="flex flex-col gap-3">
          <label className="group flex items-center justify-center gap-2 h-12 px-6 font-semibold bg-linear-to-r from-gray-50 to-gray-100 hover:from-[#7272F6]/5 hover:to-[#7272F6]/10 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#7272F6] text-gray-700 cursor-pointer transition-all duration-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-base">Choose File</span>
            <input
              type="file"
              accept="image/*"
              name="tradeRegister"
              className="hidden"
              onChange={(e) => setTradeRegister(e.target.files?.[0] || null)}
            />
          </label>
          {tradeRegister && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-green-700 font-medium">
                {tradeRegister?.name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-lg">
        <div className="ml-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
          >
            {isPending ? 'Applying...' : 'Apply'}
          </Button>
        </div>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
