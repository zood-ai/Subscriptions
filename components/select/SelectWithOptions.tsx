/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import type { StylesConfig } from 'react-select';
import { cn } from '@/lib/utils';
import { Option } from '../Select';

interface SelectWithOptionsProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  name?: string;
  customStyles: StylesConfig<Option, false>;
  disabled?: boolean;
  onFocus?: () => void;
  errorText?: string;
  required?: boolean;
  value?: string | number | string[] | null;
  onChange?: (value: string | number | string[]) => void;
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

const SelectWithOptions: React.FC<SelectWithOptionsProps> = ({
  options = [],
  placeholder = 'Select an option',
  customStyles,
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
}) => {
  const optionDefault: Option = {
    label: placeholder || optionDefaultLabel,
    value: '',
  };

  const [internalValue, setInternalValue] = useState<
    string | number | string[] | null
  >(controlledValue ?? null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const fullOptions = useMemo(() => {
    const opts = isDefault ? [optionDefault, ...options] : options;
    return opts.filter((el) => el?.value !== undefined);
  }, [options, isDefault, optionDefault]);

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

  return (
    <div
      className={cn(
        'flex flex-col placeholder:text-opacity-50 w-full',
        parentClassName
      )}
    >
      {!isHidden && label && (
        <div className="flex items-center mb-2">
          <Label className={`${labelClassName}`}>{label}</Label>
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      <Select
        options={fullOptions}
        isDisabled={disabled}
        value={selectedOption}
        onFocus={onFocus}
        onChange={(opt) => handleChange(opt as Option)}
        placeholder={placeholder}
        isLoading={loading}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
        menuPosition="fixed"
        filterOption={
          showSearch
            ? (candidate, rawInput) => {
                return candidate?.label
                  ?.toLowerCase()
                  ?.includes(rawInput?.toLowerCase());
              }
            : null
        }
        components={{
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </components.DropdownIndicator>
          ),
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        className={`custom-select-container ${className}`}
        classNamePrefix="custom-select"
        name={name}
        isSearchable={showSearch}
      />

      {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}
    </div>
  );
};

export default SelectWithOptions;
