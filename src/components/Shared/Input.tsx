import { ComponentProps, forwardRef } from 'react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { cn } from '../../helpers';

interface InputProps extends ComponentProps<'input'> {
  name: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, name, id, error, className, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={inputId}
          name={name}
          className={cn(
            'bg-white w-full rounded-lg border border-gray-500 px-3 h-[52px] text-gray-800 pt-4 placeholder-shown:pt-0 peer focus:border-gray-800 transition-all outline-none',
            className,
            error && '!border-red-900'
          )}
          placeholder=" "
        />

        <label
          htmlFor={inputId}
          className="absolute text-xs left-[13px] top-2 pointer-events-none text-gray-700 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all"
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
  }
);

Input.displayName = 'Input';
