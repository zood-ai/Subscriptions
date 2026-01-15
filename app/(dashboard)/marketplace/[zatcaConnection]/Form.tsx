"use client";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import useCustomMutation from "@/lib/Mutation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  service: z.string(),
  name: z.string().min(0, "Name  is required"),
  business: z.object({
    name: z.string().optional(),
  }),
  credentials: z.object({
    device_id: z.string().min(0, "Device is required"),
    company_name: z.string().min(0, "Company Name is required"),
    company_address: z.string().min(0, "Company Address is required"),
    company_id: z.string().min(0, "Company ID is required"),
    company_unit_name: z.string().min(0, "Company Unit Name is required"),
    company_category: z.string().min(0, "Company Category is required"),
    otp: z.string().min(1, "OTP is required"),
    egd_unit_common_name: z.string().min(0, "EGD Unit Common Name is required"),
    env: z.string().min(1, "Environment is required"),
    enable_tax_invoices: z.number().optional(),
    enable_simplified_invoices: z.number().optional(),
  }),
});

type FormData = z.infer<typeof formSchema>;

const zatcaEnvironment = [
  {
    label: "Simulation",
    value: "simulation",
  },
  {
    label: "Production",
    value: "production",
  },
];
export default function Form() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "zatca",
      name: "",
      business: {
        name: "",
      },
      credentials: {
        device_id: "",
        company_name: "",
        company_address: "",
        company_id: "",
        company_unit_name: "",
        company_category: "",
        otp: "",
        egd_unit_common_name: "",
        env: "",
        enable_tax_invoices: 0,
        enable_simplified_invoices: 1,
      },
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<FormData>({
    api: "v1/activationcode/store",
    method: "POST",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["v1/activationcode/list"],
        });
      },
      onError: (error) => {
        console.error("Error applying activation code: ", error);
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Connection Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register("name")}
          required
        />

        <SingleSelect
          label="Business"
          name="business"
          className="placeholder:text-opacity-50 z-1000000"
          placeholder="Select Business"
          errorText={errors?.business?.name?.message}
          endPoint="v1/super-admin/business"
          value={formValues.business?.name}
          onChange={(value) => {
            const event = {
              target: { name: "business.name", value },
            } as React.ChangeEvent<HTMLInputElement>;
            register("business.name").onChange(event);
          }}
          labelKey="name"
          valueKey="reference"
          required
          showSearch
        />
        {formValues.business?.name && (
          <SingleSelect
            label="Zatca Device"
            name="duration"
            className="placeholder:text-opacity-50 z-1000000"
            placeholder="Select Code Duration Period"
            errorText={errors?.credentials?.device_id?.message}
            value={formValues?.credentials?.device_id}
            onChange={(value) => {
              const event = {
                target: { name: "credentials.device_id", value },
              } as React.ChangeEvent<HTMLInputElement>;
              register("credentials.device_id").onChange(event);
            }}
            endPoint={`v1/select/devices?filter[is_deleted]=false&type=1&zatca_connection=0&reference=${formValues.business}`}
            labelKey="name"
            valueKey="id"
            loading={false}
            required
            showSearch
          />
        )}

        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Tax Registeration Number"
          error={errors?.credentials?.company_id?.message}
          value={formValues.credentials?.company_id}
          {...register("credentials.company_id")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Unit Name"
          error={errors?.credentials?.company_unit_name?.message}
          value={formValues.credentials?.company_unit_name}
          {...register("credentials.company_unit_name")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Category"
          error={errors?.credentials?.company_category?.message}
          value={formValues.credentials?.company_category}
          {...register("credentials.company_category")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="OTP"
          error={errors?.credentials?.otp?.message}
          value={formValues.credentials?.otp}
          {...register("credentials.otp")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="EGD Unit Common Name"
          error={errors?.credentials?.egd_unit_common_name?.message}
          value={formValues.credentials?.egd_unit_common_name}
          {...register("credentials.egd_unit_common_name")}
          required
        />
        <SingleSelect
          label="Environment"
          name="credentials.env"
          className="placeholder:text-opacity-50 z-1000000"
          placeholder="Select Environment"
          errorText={errors?.credentials?.env?.message}
          value={formValues.credentials?.env}
          onChange={(value) => {
            const event = {
              target: { name: "credentials.env", value },
            } as React.ChangeEvent<HTMLInputElement>;
            register("credentials.env").onChange(event);
          }}
          options={zatcaEnvironment}
          loading={false}
          required
          showSearch
        />
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4 border-t border-gray-200">
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
