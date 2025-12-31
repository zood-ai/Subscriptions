'use client';
import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CreateBusinessType,
  UpdateBusinessType,
} from '@/actions/BusinessTypesActions';

interface FormState {
  name: string;
}

export default function CreateForm({
  id = '',
  type = 'create',
  data,
}: {
  id?: string;
  type?: 'create' | 'update';
  data?: FormState;
}) {
  const [state, action, loading] = useActionState(
    type === 'create' ? CreateBusinessType : UpdateBusinessType,
    {}
  );
  const [formState, setFormState] = useState<FormState>({
    name: data?.name || '',
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
        <Input
          className=" border-gray-300 focus:border-[#7272F6] placeholder:text-opacity-50 focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
          type="text"
          id="name"
          Label="Name"
          error={state?.errors?.name}
          value={formState.name}
          name="name"
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-lg">
        <div className="ml-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary  hover:bg-primary/80 text-white rounded-full px-8"
          >
            {loading ? type + 'ing...' : type}
          </Button>
        </div>
        <p className="text-red-600 font-bold">{state?.errors?.form}</p>
      </div>
    </form>
  );
}
