"use client";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import useCustomMutation from "@/lib/Mutation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/context/ModalContext";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  business: z.string().min(1, "Business is required"),
  duration: z.string().min(1, "Duration Period is required"),
});

type FormData = z.infer<typeof formSchema>;

interface PeriodOption {
  label: string;
  value: string;
}

const zatcaEnvironment: PeriodOption[] = [
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
  const { close } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      duration: "",
      business: "",
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
        close();
      },
      onError: (error) => {
        console.error("Error applying activation code: ", error);
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };
  console.log("formValues", { businessSelected: formValues.business });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Connection Name"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />

        <SingleSelect
          label="Business"
          name="business"
          className="placeholder:text-opacity-50 z-1000000"
          placeholder="Select Business"
          errorText={errors?.business?.message}
          endPoint="v1/super-admin/business"
          value={formValues.business?.name}
          onChange={(value) => {
            const event = {
              target: { name: "business", value },
            } as React.ChangeEvent<HTMLInputElement>;
            register("business").onChange(event);
          }}
          labelKey="name"
          valueKey="reference"
          required
          showSearch
        />
        {formValues.business && (
          <SingleSelect
            label="Zatca Device"
            name="duration"
            className="placeholder:text-opacity-50 z-1000000"
            placeholder="Select Code Duration Period"
            errorText={errors?.duration?.message}
            value={formValues.duration}
            onChange={(value) => {
              const event = {
                target: { name: "duration", value },
              } as React.ChangeEvent<HTMLInputElement>;
              register("duration").onChange(event);
            }}
            //
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
          Label="Connection Name"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Tax Registeration Number *"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Unit Name"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Company Category"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="OTP"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="EGD Unit Common Name"
          error={errors?.code?.message}
          value={formValues.code}
          {...register("code")}
          required
        />
        <SingleSelect
          label="Environment"
          name="duration"
          className="placeholder:text-opacity-50 z-1000000"
          placeholder="Select Code Duration Period"
          errorText={errors?.duration?.message}
          value={formValues.duration}
          onChange={(value) => {
            const event = {
              target: { name: "duration", value },
            } as React.ChangeEvent<HTMLInputElement>;
            register("duration").onChange(event);
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
