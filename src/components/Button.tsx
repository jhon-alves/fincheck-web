import { ComponentProps } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
}

export function Button({ isLoading, disabled, children, ...props}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="bg-teal-900 text-white rounded-2xl h-[52px] hover:bg-teal-800
      transition-all ease-in-out disabled:bg-transparent disabled:cursor-not-allowed
      px-4 flex items-center justify-center"
    >
      {!isLoading && children}
      {isLoading && <Spinner className="w-6 h-6" />}
    </button>
  );
}
