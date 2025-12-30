"use client";
import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/SingleSelect";
import { Button } from "@/components/ui/button";
import { RegisterCustomerAction } from "@/actions/CustomerActions";

interface businessTypesResponce {
  id: string;
  name: string;
}

interface countriesResponce {
  id: string;
  name_en: string;
}

interface CreateFormProps {
  countries: countriesResponce[];
  businessTypes: businessTypesResponce[];
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  business_name: string;
  business_type_id: string;
  business_location_id: string;
  tradeRegister: File | null;
  emailAlert: boolean;
}

export default function CreateForm({
  countries,
  businessTypes,
}: CreateFormProps) {
  const [state, action, loading] = useActionState(RegisterCustomerAction, {});
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    business_name: "",
    business_type_id: "",
    business_location_id: "70c4bc20-1fe4-48b2-87c5-26407fe09cde",
    tradeRegister: null,
    emailAlert: false,
  });
  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form action={action} className="w-full">
      <div className="space-y-6">
        {/* Full Name */}
        <Input
          className=" border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          id="name"
          Label="Full Name"
          error={state?.errors?.name}
          value={formState.name}
          name="name"
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        {/* Email */}
        <Input
          className="  border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="email"
          Label="Email"
          id="email"
          error={state?.errors?.email}
          name="email"
          value={formState.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />

        {/* Phone */}
        <Input
          className="  border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          Label="Phone"
          id="phone"
          error={state?.errors?.phone}
          name="phone"
          value={formState.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />

        {/* Password */}
        <Input
          Label="Password"
          className="border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="password"
          name="password"
          id="password"
          error={state?.errors?.password}
          value={formState.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Business Name */}
        <Input
          className="  border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          id="business_name"
          Label="Business Name"
          error={state?.errors?.business_name}
          name="business_name"
          value={formState.business_name}
          onChange={(e) => handleChange("business_name", e.target.value)}
          required
        />

        {/* Business Type */}
        <SingleSelect
          label="Business Type"
          name="business_type_id"
          className="placeholder:text-opacity-50"
          placeholder="Select business type"
          errorText={state?.errors?.business_type_id}
          value={formState.business_type_id}
          onChange={(value) => handleChange("business_type_id", value)}
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
          errorText={state?.errors?.business_location_id}
          value={formState.business_location_id}
          onChange={(value) => handleChange("business_location_id", value)}
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
        <div>
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
                onChange={(e) =>
                  handleChange("tradeRegister", e.target.files?.[0] || null)
                }
              />
            </label>
            {formState.tradeRegister && (
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
                  {formState.tradeRegister?.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-lg">
        <div className="ml-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary  hover:bg-primary/80 text-white rounded-full px-8"
          >
            {loading ? "Applying..." : "Apply"}
          </Button>
        </div>
        <p className="text-red-600 font-bold">{state?.errors?.form}</p>
      </div>
    </form>
  );
}
