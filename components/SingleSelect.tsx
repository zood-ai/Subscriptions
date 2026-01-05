/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import type { StylesConfig, CSSObjectWithLabel } from 'react-select';

import useCustomQuery from '@/lib/Query';
export type Option = { label: string; value: string | number; item?: unknown };

interface WithOptions {
  options: Option[];
  endPoint?: never;
  labelKey?: never;
  valueKey?: never;
}

interface WithEndPoint<L, V> {
  options?: never;
  endPoint: string;
  labelKey: L;
  valueKey: V;
}

interface SingleSelectProps {
  placeholder?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  onFocus?: () => void;
  errorText?: string;
  required?: boolean;
  value?: string | null;
  onChange?: (value: string | number) => void;
  onValueChange?: (option: Option | null) => void;
  loading?: boolean;
  className?: string;
  parentClassName?: string;
  labelClassName?: string;
  showSearch?: boolean;
  isHidden?: boolean;
  isDefault?: boolean;
  optionDefaultLabel?: string;
}

type SelectProps<L, V> = SingleSelectProps & (WithOptions | WithEndPoint<L, V>);

type ApiResponse<T> = {
  data: T[];
};

const SingleSelect = <T, L = 'name', V = 'id'>({
  options = [],
  placeholder = 'Select an option',
  label,
  name,
  disabled = false,
  onFocus,
  errorText,
  required = false,
  value: controlledValue,
  onChange,
  onValueChange,
  loading = false,
  parentClassName = '',
  labelClassName = '',
  showSearch = true,
  className = '',
  isDefault = false,
  optionDefaultLabel = 'Choose one',
  isHidden = false,
  endPoint,
  // to choice what the key you need to become a label for the select option
  labelKey = '' as L,
  // to choice what the key you need to become a value for the select option
  valueKey = '' as V,
}: SelectProps<L, V>) => {
  const optionDefault: Option = {
    label: placeholder || optionDefaultLabel,
    value: '',
  };

  const {
    data: fetchedData,
    isLoading: isFetching,
    error: fetchError,
  } = useCustomQuery<ApiResponse<T>>({
    queryKey: [endPoint || 'select-options'],
    api: endPoint ?? '',
    enabled: !!endPoint,
  });
  const fetchedOptions = useMemo(() => {
    if (!fetchedData?.data || !Array.isArray(fetchedData?.data)) return [];
    return fetchedData?.data?.map((item: T) => ({
      label: item[labelKey as keyof T],
      value: String(item[valueKey as keyof T]),
      item,
    }));
  }, [fetchedData, labelKey, valueKey]);

  const finalOptions = endPoint ? fetchedOptions : options;
  const isLoading = endPoint ? isFetching : loading;

  const [internalValue, setInternalValue] = useState<string | number | null>(
    controlledValue ?? null
  );
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const fullOptions = useMemo(() => {
    const opts = isDefault ? [optionDefault, ...finalOptions] : finalOptions;
    return opts.filter((el) => el?.value !== undefined);
  }, [finalOptions, isDefault, optionDefault]);

  const selectedOption = useMemo(
    () => fullOptions.find((o) => o.value === value) || null,
    [fullOptions, value]
  );

  const handleChange = (opt: Option | null) => {
    if (!opt) return;

    const newValue = opt.value === '' ? null : opt.value;
    setInternalValue(newValue);
    onValueChange?.(opt);
    onChange?.(newValue || '');
  };

  const customStyles: StylesConfig<Option, false> = {
    control: (base, state): CSSObjectWithLabel => ({
      ...base,
      display: isHidden ? 'hidden' : '',
      minHeight: 50,
      borderRadius: 9999, // rounded-full
      borderColor: state.isFocused ? '#7272F6' : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(114, 114, 246, 0.2)'
        : 'none',
      paddingLeft: 16,
      paddingRight: 16,
      cursor: disabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        borderColor: '#7272F6',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(0,0,0,0.4)',
      fontSize: '13px',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '13px',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      padding: 4,
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#7272F6',
        borderRadius: '3px',
      },
    }),
    option: (base, state): CSSObjectWithLabel => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#7272F6'
        : state.isFocused
        ? '#f3f4f6'
        : 'white',
      color: state.isSelected
        ? 'white'
        : state.data.value === ''
        ? '#9ca3af'
        : '#000',
      cursor: 'pointer',
      padding: '10px 12px',
      borderRadius: 4,
      fontSize: '13px',
      '&:active': {
        backgroundColor: '#5656E8',
      },
    }),
  };

  return (
    <div
      className={`flex flex-col placeholder:text-opacity-50 w-full ${parentClassName}`}
    >
      {!isHidden && label && (
        <div className="flex items-center mb-2">
          <Label
            className={`text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
          </Label>
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      <div className={`relative ${className}`}>
        <Select
          options={fullOptions}
          isDisabled={disabled}
          value={selectedOption}
          onFocus={onFocus}
          onChange={(opt) => handleChange(opt as Option)}
          placeholder={placeholder}
          isLoading={isLoading}
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          menuPosition="fixed"
          filterOption={(candidate, rawInput) => {
            if (!showSearch) return true;
            return candidate?.label
              ?.toLowerCase()
              ?.includes(rawInput?.toLowerCase());
          }}
          components={{
            DropdownIndicator: (props) => (
              <components.DropdownIndicator {...props}>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </components.DropdownIndicator>
            ),
            IndicatorSeparator: () => null,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          styles={customStyles as any}
          className="custom-select-container"
          classNamePrefix="custom-select"
          name={name}
          isSearchable={showSearch}
        />
      </div>

      {(errorText || fetchError) && (
        <p className="text-red-500 text-sm mt-1">
          {errorText || fetchError?.data?.message || 'Failed to load options'}
        </p>
      )}
    </div>
  );
};

export default SingleSelect;
