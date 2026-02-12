'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCustomMutation from '@/lib/Mutation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  CONTROL_PERMISSION_GROUPS,
} from '@/constants/permissions';
import Select from '@/components/Select';
import { useState } from 'react';

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

const projectOptions = [
  { label: 'Zood Light', value: 'zood-light' },
  { label: 'Control', value: 'control' },
];

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
  const [selectedProject, setSelectedProject] = useState<string>('');

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
    api: isEdit ? `v1/super-admin/roles/${id}` : 'v1/super-admin/roles',
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

  const handleToggleControlGroup = (groupKey: string, checked: boolean) => {
    const currentAuthorities = getValues('authorities') || [];
    const groupPermissions =
      CONTROL_PERMISSION_GROUPS[
        groupKey as keyof typeof CONTROL_PERMISSION_GROUPS
      ].permissions;

    const permissionValues = groupPermissions.map((p) => p.value);

    if (checked) {
      const newAuthorities = [
        ...new Set([...currentAuthorities, ...permissionValues]),
      ];
      setValue('authorities', newAuthorities);
    } else {
      const newAuthorities = currentAuthorities.filter(
        (auth) => !permissionValues.includes(auth)
      );
      setValue('authorities', newAuthorities);
    }
  };

  const handleTogglePermission = (permission: string, checked: boolean) => {
    const currentAuthorities = getValues('authorities') || [];
    if (checked) {
      setValue('authorities', [...currentAuthorities, permission]);
    } else {
      setValue(
        'authorities',
        currentAuthorities.filter((p) => p !== permission)
      );
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

  const isControlGroupSelected = (groupKey: string) => {
    const currentAuthorities = getValues('authorities') || [];
    const groupPermissions =
      CONTROL_PERMISSION_GROUPS[
        groupKey as keyof typeof CONTROL_PERMISSION_GROUPS
      ].permissions;

    const permissionValues = groupPermissions.map((p) => p.value);

    return (
      permissionValues.length > 0 &&
      permissionValues.every((perm) => currentAuthorities.includes(perm))
    );
  };

  const isPermissionSelected = (permission: string) => {
    const currentAuthorities = getValues('authorities') || [];
    return currentAuthorities.includes(permission);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setValue('authorities', []);
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

        <div className="space-y-2">
          <Select
            label="Project"
            value={selectedProject}
            onChange={(value) => {
              handleProjectChange(value as string);
            }}
            options={projectOptions}
            required
          />
        </div>

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

          {!selectedProject ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Select Project First
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Please select a project from the dropdown above to view
                    available permissions
                  </p>
                </div>
              </div>
            </div>
          ) : selectedProject === 'zood-light' ? (
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
          ) : selectedProject === 'control' ? (
            <div className="border rounded-md p-6 bg-white">
              <div className="flex items-center gap-2 space-x-2 mb-6 pb-4 border-b">
                <Checkbox
                  checked={isAllSelected()}
                  onCheckedChange={(checked) =>
                    handleToggleAll(checked as boolean)
                  }
                />
                <label className="text-base font-bold leading-none cursor-pointer select-none">
                  Toggle All
                </label>
              </div>

              <div className="space-y-6">
                {Object.entries(CONTROL_PERMISSION_GROUPS).map(
                  ([groupKey, group]) => (
                    <div key={groupKey} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                        <Checkbox
                          checked={isControlGroupSelected(groupKey)}
                          onCheckedChange={(checked) =>
                            handleToggleControlGroup(
                              groupKey,
                              checked as boolean
                            )
                          }
                        />
                        <h3 className="text-sm font-bold text-gray-900">
                          {group.name}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {group.permissions.map((permission) => (
                          <div
                            key={permission.value}
                            className="flex items-center space-x-2 gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              checked={isPermissionSelected(permission.value)}
                              onCheckedChange={(checked) =>
                                handleTogglePermission(
                                  permission.value,
                                  checked as boolean
                                )
                              }
                            />
                            <label className="text-xs font-medium leading-none cursor-pointer select-none flex-1">
                              {permission.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : null}
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
