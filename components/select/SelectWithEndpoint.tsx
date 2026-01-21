/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';
import { components } from 'react-select';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import type { StylesConfig } from 'react-select';
import { cn } from '@/lib/utils';
import { Option } from '../SingleSelect';
import axiosInstance from '@/guards/axiosInstance';
import useCustomQuery from '@/lib/Query';

interface SelectWithEndpointProps<T> {
  endPoint: string;
  labelKey: keyof T;
  valueKey: keyof T;
  itemResponseDataKey?: string;
  placeholder?: string;
  customStyles: StylesConfig<Option, false>;
  label?: string;
  name?: string;
  disabled?: boolean;
  onFocus?: () => void;
  errorText?: string;
  required?: boolean;
  value?: string | number | null;
  onChange?: (value: string | number) => void;
  onValueChange?: (option: Option | null) => void;
  className?: string;
  parentClassName?: string;
  labelClassName?: string;
  showSearch?: boolean;
  isHidden?: boolean;
  isDefault?: boolean;
  optionDefaultLabel?: string;
}

type Additional = {
  page: number;
};

const SelectWithEndpoint = <T,>({
  endPoint,
  labelKey,
  valueKey,
  // this key is for items that we cant acces with data?.data
  // for example data?.data?.businessType then itemResponseDataKey=businessType
  // itemResponseDataKey="" this equal data?.data
  itemResponseDataKey = '',
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
  parentClassName = '',
  labelClassName = '',
  showSearch = true,
  className = '',
  isDefault = false,
  optionDefaultLabel = 'Choose one',
  isHidden = false,
}: SelectWithEndpointProps<T>) => {
  const optionDefault: Option = useMemo(
    () => ({
      label: placeholder || optionDefaultLabel,
      value: '',
    }),
    [placeholder, optionDefaultLabel]
  );
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);

  const { data, isLoading: isLoadingInitItem = false } = useCustomQuery<{
    [key: string]: T;
  }>({
    queryKey: [endPoint, controlledValue, itemResponseDataKey],
    api: `${endPoint}/${controlledValue}`,
    enabled: !!controlledValue,
  });

  // Load options with pagination and search
  const loadOptions: LoadOptions<Option, any, Additional> = useCallback(
    async (search, _, additional) => {
      try {
        setPaginationLoading(true);
        const page = additional?.page || 1;
        const separator = endPoint.includes('?') ? '&' : '?';
        let url = `${endPoint}${separator}page=${page}`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        const res = await axiosInstance(url);
        const responseData = res.data;

        const items: T[] = responseData.data || [];

        const options: Option[] = items.map((item: T) => ({
          value: String(item[valueKey]),
          label: String(item[labelKey]),
          item,
        }));

        const finalOptions =
          isDefault && page === 1 && !search
            ? [optionDefault, ...options]
            : options;

        const hasMore =
          responseData.current_page && responseData.last_page
            ? responseData.current_page < responseData.last_page
            : false;

        return {
          options: finalOptions,
          hasMore,
          additional: {
            page: page + 1,
          },
        };
      } catch (error) {
        console.error('Error loading options:', error);
        setPaginationLoading(false);
        return {
          options: [],
          hasMore: false,
          additional: {
            page: 1,
          },
        };
      } finally {
        setPaginationLoading(false);
      }
    },
    [endPoint, labelKey, valueKey, isDefault, optionDefault]
  );

  const handleChange = (opt: Option | null) => {
    setSelectedOption(opt);
    const newValue = opt?.value === '' || !opt ? null : opt.value;
    onValueChange?.(opt);
    onChange?.(newValue || '');
  };

  useEffect(() => {
    if (data) {
      const item = itemResponseDataKey
        ? (data[itemResponseDataKey] as T)
        : (data as T);
      setSelectedOption({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
        item,
      });
    }
  }, [data, itemResponseDataKey, labelKey, valueKey]);

  return (
    <div
      className={cn(
        'flex flex-col placeholder:text-opacity-50 w-full',
        parentClassName
      )}
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

      <AsyncPaginate
        value={selectedOption}
        loadOptions={loadOptions}
        onChange={handleChange}
        additional={{ page: 1 }}
        isDisabled={disabled}
        onFocus={onFocus}
        placeholder={placeholder}
        debounceTimeout={300}
        cacheUniqs={[endPoint]}
        isLoading={isLoadingInitItem || paginationLoading}
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
        isClearable
      />

      {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}
    </div>
  );
};

export default SelectWithEndpoint;
