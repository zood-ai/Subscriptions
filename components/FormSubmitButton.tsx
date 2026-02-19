import React from 'react';
import { Button, buttonVariantsTypes } from './ui/button';
import { AxiosResponse } from 'axios';
import { cn } from '@/lib/utils';

const FormSubmitButton = ({
  isPending,
  btnText,
  error,
  buttonType = 'submit',
  buttonVariant = 'primary',
  buttonClassName = '',
}: {
  isPending: boolean;
  btnText: string;
  error: AxiosResponse | null;
  buttonType?: 'submit' | 'button' | 'reset';
  buttonVariant?: buttonVariantsTypes;
  buttonClassName?: string;
}) => {
  return (
    <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4 border-t border-gray-200">
      <Button
        type={buttonType}
        disabled={isPending}
        loading={isPending}
        variant={buttonVariant}
        className={cn('px-8', buttonClassName)}
      >
        {isPending ? `Loading...` : btnText}
      </Button>
      {error && <p className="text-red-600 font-bold">{error.data?.message}</p>}
    </div>
  );
};

export default FormSubmitButton;
