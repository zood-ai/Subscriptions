"use client";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import useCustomMutation from "@/lib/Mutation";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Country } from "@/types/countries";

const baseSchema = {
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  business_name: z.string().min(1, "Business name is required"),
  package_id: z.string().min(1, "Package is required"),
  business_type_id: z.string().min(1, "Business type is required"),
  business_location_id: z.string().min(1, "Country is required"),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

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

interface FormState {
  name: string;
  email: string;
  phone: string;
  password?: string;
  package_id: string;
  business_name: string;
  business_type_id: string;
  business_location_id: string;
}

export default function Form({
  id = "",
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormState;
}) {
  const schema = isEdit ? editSchema : createSchema;
  type FormData = z.infer<typeof schema>;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      password: "",
      business_name: data?.business_name ?? "",
      package_id: data?.package_id ?? "",
      business_type_id: data?.business_type_id ?? "",
      business_location_id: data?.business_location_id ?? "",
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CustomerRegistrationResponse
  >({
    api: isEdit ? `v1/super-admin/business/${id}` : "v1/auth/Register",
    method: isEdit ? "PUT" : "POST",
    queryKeys: isEdit ? ["business", id] : [],
    options: {
      onSuccess: (data) => {
        if (!isEdit && data?.data?.user?.business_reference) {
          router.push(
            `/manage-business/business/${data.data.user.business_reference}`,
          );
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEdit && !data.password) delete data.password;
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        {/* Full Name */}
        <Input
          type="text"
          Label="Full Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register("name")}
          required
        />

        {/* Email */}
        <Input
          type="email"
          Label="Email"
          error={errors?.email?.message}
          value={formValues.email}
          {...register("email")}
          required
        />

        {/* Phone */}
        <Input
          type="text"
          Label="Phone"
          error={errors?.phone?.message}
          value={formValues.phone}
          {...register("phone")}
          required
        />

        {/* Password */}
        <Input
          Label="Password"
          type="password"
          error={errors?.password?.message}
          value={formValues.password}
          {...register("password")}
          required={!isEdit}
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Business Name */}
        <Input
          type="text"
          Label="Business Name"
          error={errors?.business_name?.message}
          value={formValues.business_name}
          {...register("business_name")}
          required
        />

        {/* Business Type */}
        <Controller
          name="business_type_id"
          control={control}
          render={({ field }) => (
            <SingleSelect<{
              id: string;
              name: string;
            }>
              label="Business Type"
              placeholder="Select business type"
              errorText={errors?.business_type_id?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/super-admin/businessTypes"
              labelKey="name"
              valueKey="id"
              required
            />
          )}
        />

        {/* Packages */}
        <Controller
          name="package_id"
          control={control}
          render={({ field }) => (
            <SingleSelect<{
              id: string;
              name: string;
            }>
              label="Package"
              errorText={errors?.package_id?.message}
              value={String(field.value)}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/super-admin/packages"
              labelKey="name"
              valueKey="id"
              required
            />
          )}
        />

        {/* Country */}
        <Controller
          name="business_location_id"
          control={control}
          render={({ field }) => (
            <SingleSelect<Country, "name_en">
              label="Country"
              placeholder="Select country"
              errorText={errors?.business_location_id?.message}
              value={formValues.business_location_id}
              onChange={(value) => field.onChange(value)}
              endPoint="v1/super-admin/countries"
              labelKey="name_en"
              valueKey="id"
              required
            />
          )}
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
        >
          {isPending ? "Applying..." : "Apply"}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
