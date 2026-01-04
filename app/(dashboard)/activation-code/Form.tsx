"use client";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import useCustomMutation from "@/lib/Mutation";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  period: z.string().min(1, "Period is required"),
});

type FormData = z.infer<typeof formSchema>;

interface BusinessTypes {
  id: string;
  name: string;
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

interface PeriodOption {
  label: string;
  value: string;
}

export default function Form() {
  const router = useRouter();
  const periodOptions: PeriodOption[] = [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      period: "",
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CustomerRegistrationResponse
  >({
    api: "v1/auth/Register",
    method: "POST",
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
          Label="Code"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />

        {/* Country */}
        <SingleSelect
          label="Country"
          name="business_location_id"
          className="placeholder:text-opacity-50"
          placeholder="Select country"
          errorText={errors?.period?.message}
          value={formValues.period}
          onChange={(value) => {
            const event = {
              target: { name: "business_location_id", value },
            } as React.ChangeEvent<HTMLInputElement>;
            register("period").onChange(event);
          }}
          options={periodOptions}
          loading={false}
          required
          showSearch
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>
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
