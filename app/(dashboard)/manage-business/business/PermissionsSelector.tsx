'use client';
import { Checkbox } from '@/components/ui/checkbox';
import Select from '@/components/Select';
import {
  ZOOD_LIGHT_PERMISSIONS_GROUPS,
  CONTROL_PERMISSIONS,
  ZOOD_LIGHT_PERMISSIONS,
  CONTROL_PERMISSIONS_GROUPS,
} from '@/constants/permissions';
import { useMemo, useState } from 'react';
import { AllProjects } from '@/constants/global';

interface PermissionsSelectorProps {
  value: string[];
  onChange: (permissions: string[]) => void;
  error?: string;
  projectValue?: string;
  onProjectChange?: (project: string) => void;
  projectError?: string;
  projectPlaceholder?: string;
  projectDisabled?: boolean;
  projectRequired?: boolean;
}

export default function PermissionsSelector({
  value,
  onChange,
  error,
  projectValue,
  onProjectChange,
  projectError,
  projectPlaceholder = 'Select option',
  projectDisabled = false,
  projectRequired = false,
}: PermissionsSelectorProps) {
  const [internalProject, setInternalProject] = useState('');
  const isControlled = projectValue !== undefined;
  const selectedProject = isControlled ? projectValue : internalProject;

  const internalAllPermissions = useMemo(() => {
    if (selectedProject === 'zood-light') {
      return ZOOD_LIGHT_PERMISSIONS;
    } else if (selectedProject === 'control') {
      return CONTROL_PERMISSIONS;
    } else {
      return [];
    }
  }, [selectedProject]);

  const handleProjectChange = (project: string) => {
    onChange([]);
    if (isControlled) {
      onProjectChange?.(project);
    } else {
      setInternalProject(project);
    }
  };

  const handleToggleAll = (checked: boolean) => {
    onChange(checked ? [...internalAllPermissions] : []);
  };

  const handleToggleGroup = (groupKey: string, checked: boolean) => {
    const groupPermissions =
      ZOOD_LIGHT_PERMISSIONS_GROUPS[
        groupKey as keyof typeof ZOOD_LIGHT_PERMISSIONS_GROUPS
      ].permissions;
    if (checked) {
      onChange([...new Set([...value, ...groupPermissions])]);
    } else {
      onChange(value.filter((auth) => !groupPermissions.includes(auth)));
    }
  };

  const handleToggleControlGroup = (groupKey: string, checked: boolean) => {
    const permissionValues = CONTROL_PERMISSIONS_GROUPS[
      groupKey as keyof typeof CONTROL_PERMISSIONS_GROUPS
    ].permissions.map((p) => p.value);
    if (checked) {
      onChange([...new Set([...value, ...permissionValues])]);
    } else {
      onChange(value.filter((auth) => !permissionValues.includes(auth)));
    }
  };

  const handleTogglePermission = (permission: string, checked: boolean) => {
    if (checked) {
      onChange([...value, permission]);
    } else {
      onChange(value.filter((p) => p !== permission));
    }
  };

  const isAllSelected =
    value.length > 0 &&
    internalAllPermissions.every((perm) => value.includes(perm));

  const isGroupSelected = (groupKey: string) => {
    const groupPermissions =
      ZOOD_LIGHT_PERMISSIONS_GROUPS[
        groupKey as keyof typeof ZOOD_LIGHT_PERMISSIONS_GROUPS
      ].permissions;
    return (
      groupPermissions.length > 0 &&
      groupPermissions.every((perm) => value.includes(perm))
    );
  };

  const isControlGroupSelected = (groupKey: string) => {
    const permissionValues = CONTROL_PERMISSIONS_GROUPS[
      groupKey as keyof typeof CONTROL_PERMISSIONS_GROUPS
    ].permissions.map((p) => p.value);
    return (
      permissionValues.length > 0 &&
      permissionValues.every((perm) => value.includes(perm))
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select
          label="Project"
          value={selectedProject}
          onChange={(val) => handleProjectChange(val as string)}
          options={AllProjects}
          placeholder={projectPlaceholder}
          errorText={projectError}
          required={projectRequired}
          disabled={projectDisabled}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Permissions <span className="text-red-500">*</span>
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {!selectedProject && (
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
      )}

      {selectedProject === 'zood-light' && (
        <div className="border rounded-md p-6 bg-white">
          <div className="flex items-center gap-2 space-x-2 mb-6 pb-4 border-b">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => handleToggleAll(checked as boolean)}
            />
            <label className="text-base font-bold leading-none cursor-pointer select-none">
              Toggle All Permissions
            </label>
          </div>

          <div className="space-y-3">
            {Object.entries(ZOOD_LIGHT_PERMISSIONS_GROUPS).map(
              ([groupKey, group]) => (
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
              )
            )}
          </div>
        </div>
      )}

      {selectedProject === 'control' && (
        <div className="border rounded-md p-6 bg-white">
          <div className="flex items-center gap-2 space-x-2 mb-6 pb-4 border-b">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => handleToggleAll(checked as boolean)}
            />
            <label className="text-base font-bold leading-none cursor-pointer select-none">
              Toggle All
            </label>
          </div>

          <div className="space-y-6">
            {Object.entries(CONTROL_PERMISSIONS_GROUPS).map(
              ([groupKey, group]) => (
                <div key={groupKey} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                    <Checkbox
                      checked={isControlGroupSelected(groupKey)}
                      onCheckedChange={(checked) =>
                        handleToggleControlGroup(groupKey, checked as boolean)
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
                          checked={value.includes(permission.value)}
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
      )}
    </div>
  );
}
