import { ComponentProps, forwardRef } from 'react';
import { CrossCircledIcon } from '@radix-ui/react-icons'
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface InputProps extends ComponentProps<'input'> {
  name: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, name, placeholder, error, ...props }, ref) => {
  const inputId = id ?? name;

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        name={name}
        id={inputId}
        placeholder=" "
        className={twMerge(clsx(
          'bg-white w-full rounded-lg border border-gray-500 px-3 h-[52px] text-gray-800 pt-4 peer placeholder-shown:pt-0 focus:border-gray-800 transition-all outline-none',
          error && '!border-red-900'
        ))}
      />
      <label
        htmlFor={inputId}
        className="absolute text-xs left-[13px] top-1.5 pointer-events-none text-gray-700
        peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 transition-all"
      >
        {placeholder}
      </label>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-900">
          <CrossCircledIcon />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
});
