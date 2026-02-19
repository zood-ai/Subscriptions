'use client';
import { Checkbox } from '@/components/ui/checkbox';
import Select from '@/components/Select';
import {
  ZOOD_LIGHT_PERMISSIONS_GROUPS,
  CONTROL_PERMISSIONS_GROUPS,
} from '@/constants/permissions';
import { useMemo, useState } from 'react';
import { AllProjects } from '@/constants/global';

interface PermissionsSelectorProps {
  value: string[];
  groupKeys?: string[];
  onChange: (permissions: string[]) => void;
  onChangeGroupKeys?: (groupKeys: string[]) => void;
  error?: string;
  projectValue?: string;
  onProjectChange?: (project: string) => void;
  projectError?: string;
  projectPlaceholder?: string;
  projectDisabled?: boolean;
  projectRequired?: boolean;
}

export function flattenPermissions(
  groupKeys: string[],
  project: string
): string[] {
  const all: string[] = [];
  if (project === 'zood-light') {
    for (const key of groupKeys) {
      const group =
        ZOOD_LIGHT_PERMISSIONS_GROUPS[
          key as keyof typeof ZOOD_LIGHT_PERMISSIONS_GROUPS
        ];
      if (group) all.push(...group.permissions);
    }
  } else if (project === 'control') {
    for (const key of groupKeys) {
      const group =
        CONTROL_PERMISSIONS_GROUPS[
          key as keyof typeof CONTROL_PERMISSIONS_GROUPS
        ];
      if (group) all.push(...group.permissions.map((p) => p.value));
    }
  }
  return [...new Set(all)];
}

function permissionsToGroupKeys(
  permissions: string[],
  project: string
): string[] {
  if (project === 'zood-light') {
    return Object.entries(ZOOD_LIGHT_PERMISSIONS_GROUPS)
      .filter(
        ([, g]) =>
          g.permissions.length > 0 &&
          g.permissions.every((p) => permissions.includes(p))
      )
      .map(([key]) => key);
  }
  if (project === 'control') {
    return Object.entries(CONTROL_PERMISSIONS_GROUPS)
      .filter(([, g]) => {
        const vals = g.permissions.map((p) => p.value);
        return vals.length > 0 && vals.every((p) => permissions.includes(p));
      })
      .map(([key]) => key);
  }
  return [];
}

export default function PermissionsSelector({
  value,
  groupKeys,
  onChange,
  onChangeGroupKeys,
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

  const selectedGroupKeys = useMemo(() => {
    if (groupKeys && groupKeys.length > 0) return groupKeys;
    return permissionsToGroupKeys(value, selectedProject);
  }, [groupKeys, value, selectedProject]);

  const allGroupKeys = useMemo(() => {
    if (selectedProject === 'zood-light')
      return Object.keys(ZOOD_LIGHT_PERMISSIONS_GROUPS);
    if (selectedProject === 'control')
      return Object.keys(CONTROL_PERMISSIONS_GROUPS);
    return [];
  }, [selectedProject]);

  const emit = (newGroupKeys: string[]) => {
    onChange(flattenPermissions(newGroupKeys, selectedProject));
    onChangeGroupKeys?.(newGroupKeys);
  };

  const handleProjectChange = (project: string) => {
    onChange([]);
    onChangeGroupKeys?.([]);
    if (isControlled) {
      onProjectChange?.(project);
    } else {
      setInternalProject(project);
    }
  };

  const handleToggleAll = (checked: boolean) => {
    emit(checked ? [...allGroupKeys] : []);
  };

  const handleToggleGroup = (groupKey: string, checked: boolean) => {
    const newGroupKeys = checked
      ? [...selectedGroupKeys, groupKey]
      : selectedGroupKeys.filter((k) => k !== groupKey);
    emit(newGroupKeys);
  };

  const isAllSelected =
    allGroupKeys.length > 0 &&
    allGroupKeys.every((k) => selectedGroupKeys.includes(k));

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
              Toggle All
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
                    checked={selectedGroupKeys.includes(groupKey)}
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
                <div key={groupKey} className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                    <Checkbox
                      checked={selectedGroupKeys.includes(groupKey)}
                      onCheckedChange={(checked) =>
                        handleToggleGroup(groupKey, checked as boolean)
                      }
                    />
                    <h3 className="text-sm font-bold text-gray-900">
                      {group.name}
                    </h3>
                  </div>

                  <div className="pl-7 flex flex-wrap gap-1">
                    {group.permissions.map((permission) => (
                      <span
                        key={permission.value}
                        className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5"
                      >
                        {permission.label}
                      </span>
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
