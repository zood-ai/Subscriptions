"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCustomMutation from "@/lib/Mutation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CountryResponseData } from "@/types/countries";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Country Name is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Form({
  id = "",
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormData;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CountryResponseData
  >({
    api: isEdit ? `v1/manage/countries/${id}` : "v1/manage/countries",
    method: isEdit ? "PUT" : "POST",
    options: {
      onSuccess: (data) => {
        if (isEdit) {
          queryClient.invalidateQueries({
            queryKey: ["countries", id],
          });
        } else {
          router.push(`/countries/${data.data.id}`);
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
        <Input
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Country Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register("name")}
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
