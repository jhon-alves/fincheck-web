import { ComponentProps, forwardRef } from 'react';
import { cn } from '../../helpers';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  // Lima sempre com texto ink-950 por cima
  primary:
    'bg-primary text-on-primary hover:brightness-95 active:brightness-90 shadow-[inset_0_-1px_0_rgb(0_0_0/0.08)]',
  secondary:
    'bg-card text-fg border border-border hover:bg-subtle',
  ghost: 'bg-transparent text-fg-soft hover:bg-subtle hover:text-fg',
  danger: 'bg-expense text-white hover:brightness-95',
  dark: 'bg-fg text-card hover:opacity-90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-2xl gap-2',
  lg: 'h-12 px-6 text-base rounded-2xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      isLoading,
      disabled,
      children,
      variant = 'primary',
      size = 'md',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          'inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-[background-color,filter,opacity,transform] duration-150 select-none',
          'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring',
          variants[variant],
          sizes[size],
          className,
        )}
      >
        {isLoading ? <Spinner className="size-5" /> : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
