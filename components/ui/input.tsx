'use client';
import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  error?: string;
  isHidden?: boolean;
  parentClassName?: string;
  required?: boolean;
  disabled?: boolean;
  animateLabel?: boolean;
  Label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      parentClassName,
      required = false,
      animateLabel = false,
      error,
      Label = '',
      labelClassName,
      type,
      value = '',
      onChange,
      disabled = false,
      isHidden = false,
      ...props
    },
    ref
  ) => {
    const [inputType, setInputType] = useState(type);

    return (
      <div className={cn('relative w-full', parentClassName)}>
        {!isHidden && Label && (
          <label
            htmlFor={props.id}
            className={cn(
              'absolute left-[25px] text-[13px] pointer-events-none transition-all duration-300',
              animateLabel
                ? value
                  ? 'top-0 text-[11px] text-primary z-1 bg-white px-1 font-extrabold '
                  : 'top-[23px] text-gray-400 z-1 font-medium'
                : 'static',
              labelClassName
            )}
          >
            {Label}
            {required && <span className="text-red-500 pl-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            required={required}
            type={inputType}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={animateLabel ? '' : props.placeholder ?? Label ?? ''}
            className={cn(
              'mt-2 border bg-white border-gray-200 rounded-full h-[50px] w-full px-[25px] py-[10px] text-[13px] outline-none placeholder:text-muted-foreground',
              'hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/50 duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isHidden ? 'hidden' : '',
              className
            )}
            {...props}
          />

          {type === 'password' && (
            <button
              type="button"
              aria-label="View password"
              onClick={() =>
                setInputType(inputType === 'password' ? 'text' : 'password')
              }
              className="absolute top-1/2 -translate-y-1/2 mt-[4px] right-3 flex items-center justify-center cursor-pointer"
            >
              {inputType === 'password' ? (
                <EyeClosed className="text-gray-600" />
              ) : (
                <Eye className="text-gray-600" />
              )}
            </button>
          )}

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
