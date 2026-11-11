import { ComponentProps, forwardRef } from 'react';
import { cn } from '../../helpers';
import { FieldError } from './FieldError';

interface InputProps extends ComponentProps<'input'> {
  name: string;
  error?: string;
}

/** Campo com rótulo flutuante: o `placeholder` vira o rótulo. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, name, id, error, className, ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            name={name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'peer h-[52px] w-full rounded-2xl border border-border bg-card px-3.5 pt-4 text-fg outline-none transition-[border-color,box-shadow]',
              'placeholder-shown:pt-0 focus:border-fg/30 focus-visible:ring-4 focus-visible:ring-ring',
              error && 'border-expense!',
              className,
            )}
            placeholder=" "
          />

          <label
            htmlFor={inputId}
            className="pointer-events-none absolute top-2 left-3.5 text-xs text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
          >
            {placeholder}
          </label>
        </div>

        <FieldError id={errorId} message={error} />
      </div>
    );
  },
);

Input.displayName = 'Input';
