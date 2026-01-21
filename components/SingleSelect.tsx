import SelectWithOptions from './select/SelectWithOptions';
import SelectWithEndpoint from './select/SelectWithEndpoint';
import type { StylesConfig, CSSObjectWithLabel } from 'react-select';
export type Option = { label: string; value: string | number; item?: unknown };

interface CommonProps {
  placeholder?: string;
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

interface WithOptions extends CommonProps {
  options: Option[];
  endPoint?: never;
  labelKey?: never;
  valueKey?: never;
  loading?: boolean;
  pageSize?: never;
}

interface WithEndPoint<T> extends CommonProps {
  options?: never;
  endPoint: string;
  labelKey: keyof T;
  valueKey: keyof T;
  loading?: never;
  itemResponseDataKey?: string;
}

type SingleSelectProps<T> = WithOptions | WithEndPoint<T>;

function SingleSelect<T>(props: SingleSelectProps<T>) {
  const customStyles: StylesConfig<Option, false> = {
    control: (base, state): CSSObjectWithLabel => ({
      ...base,
      display: props.isHidden ? 'none' : 'flex',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      minHeight: 50,
      borderRadius: 9999,
      borderColor: state.isFocused ? '#7272F6' : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(114, 114, 246, 0.2)'
        : 'none',
      paddingLeft: 16,
      paddingRight: 16,
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
    option: (base): CSSObjectWithLabel => ({
      ...base,
      cursor: 'pointer',
      padding: '10px 12px',
      borderRadius: 4,
      fontSize: '13px',
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: '#7272F6',
    }),
  };

  if ('options' in props && props.options) {
    return <SelectWithOptions {...props} customStyles={customStyles} />;
  }

  if ('endPoint' in props && props.endPoint) {
    return <SelectWithEndpoint<T> {...props} customStyles={customStyles} />;
  }

  return null;
}

export default SingleSelect;
