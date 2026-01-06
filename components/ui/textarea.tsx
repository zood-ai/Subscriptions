'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  error?: string;
  isHidden?: boolean;
  parentClassName?: string;
  required?: boolean;
  disabled?: boolean;
  Label?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      parentClassName,
      required = false,
      error,
      Label = '',
      labelClassName,
      value = '',
      onChange,
      disabled = false,
      isHidden = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full', parentClassName)}>
        {!isHidden && Label && (
          <label
            htmlFor={props.id}
            className={cn(
              'block text-[13px] font-medium mb-2 text-gray-700',
              labelClassName
            )}
          >
            {Label}
            {required && <span className="text-red-500 pl-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            required={required}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={props.placeholder ?? Label ?? ''}
            className={cn(
              'border bg-white border-gray-200 rounded-2xl min-h-[120px] w-full px-[25px] py-[15px] text-[13px] outline-none placeholder:text-muted-foreground resize-y',
              'hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/50 duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isHidden ? 'hidden' : '',
              className
            )}
            {...props}
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
