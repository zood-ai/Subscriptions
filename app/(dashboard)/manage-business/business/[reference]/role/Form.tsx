'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSION_GROUPS, ALL_PERMISSIONS } from '@/constants/permissions';

const formSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  authorities: z
    .array(z.string())
    .min(1, 'Please select at least one permission'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateResponse {
  id: string;
}

interface FormState {
  name: string;
  authorities: string[];
}

export default function RoleForm({
  id = '',
  isEdit = false,
  data,
}: {
  id?: string;
  isEdit?: boolean;
  data?: FormState;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      authorities: data?.authorities || [],
    },
  });

  const formValues = useWatch({ control });

  const { mutate, isPending, error } = useCustomMutation<
    FormData,
    CreateResponse
  >({
    api: isEdit
      ? `https://api.zood.ai/api/v1/hr/roles/${id}`
      : 'https://api.zood.ai/api/v1/hr/roles',
    method: isEdit ? 'PUT' : 'POST',
    invalidateQueryKeys: isEdit ? ['roles', id] : ['roles'],
    options: {
      onSuccess: (data) => {
        if (!isEdit) {
          router.push(`/roles/${data.id}`);
        } else {
          router.push('/roles');
        }
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setValue('authorities', [...ALL_PERMISSIONS]);
    } else {
      setValue('authorities', []);
    }
  };

  const handleToggleGroup = (groupKey: string, checked: boolean) => {
    const currentAuthorities = getValues('authorities') || [];
    const groupPermissions =
      PERMISSION_GROUPS[groupKey as keyof typeof PERMISSION_GROUPS].permissions;

    if (checked) {
      const newAuthorities = [
        ...new Set([...currentAuthorities, ...groupPermissions]),
      ];
      setValue('authorities', newAuthorities);
    } else {
      const newAuthorities = currentAuthorities.filter(
        (auth) => !groupPermissions.includes(auth)
      );
      setValue('authorities', newAuthorities);
    }
  };

  const isAllSelected = () => {
    const currentAuthorities = getValues('authorities') || [];
    return (
      currentAuthorities.length > 0 &&
      ALL_PERMISSIONS.every((perm) => currentAuthorities.includes(perm))
    );
  };

  const isGroupSelected = (groupKey: string) => {
    const currentAuthorities = getValues('authorities') || [];
    const groupPermissions =
      PERMISSION_GROUPS[groupKey as keyof typeof PERMISSION_GROUPS].permissions;
    return (
      groupPermissions.length > 0 &&
      groupPermissions.every((perm) => currentAuthorities.includes(perm))
    );
  };

  const btnText = isEdit ? 'Update' : 'Create';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <Input
          type="text"
          Label="Role Name"
          error={errors?.name?.message}
          value={formValues.name}
          {...register('name')}
          required
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Permissions <span className="text-red-500">*</span>
            </label>
            {errors?.authorities?.message && (
              <p className="text-red-600 text-sm">
                {errors.authorities.message}
              </p>
            )}
          </div>

          <div className="border rounded-md p-6 bg-white">
            <div className="flex items-center gap-2 space-x-2 mb-6 pb-4 border-b">
              <Checkbox
                checked={isAllSelected()}
                onCheckedChange={(checked) =>
                  handleToggleAll(checked as boolean)
                }
              />
              <label className="text-base font-bold leading-none cursor-pointer select-none">
                Toggle All Permissions
              </label>
            </div>

            <div className="space-y-3">
              {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
                <div
                  key={groupKey}
                  className="flex items-center space-x-2 gap-2 p-4 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Checkbox
                    checked={isGroupSelected(groupKey)}
                    onCheckedChange={(checked) =>
                      handleToggleGroup(groupKey, checked as boolean)
                    }
                  />
                  <label className="text-sm font-medium leading-none cursor-pointer select-none flex-1">
                    {group.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/80 text-white rounded-full px-8"
        >
          {isPending ? `${btnText}ing...` : btnText}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </form>
  );
}
