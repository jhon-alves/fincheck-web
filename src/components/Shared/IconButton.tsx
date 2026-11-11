import { ComponentProps, forwardRef } from 'react';
import { cn } from '../../helpers';

interface IconButtonProps extends ComponentProps<'button'> {
  /** Obrigatório: botões só com ícone precisam de nome acessível. */
  'aria-label': string;
  variant?: 'ghost' | 'card' | 'primary';
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...props}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full text-fg-soft transition-colors',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-40',
        size === 'md' ? 'size-10' : 'size-8',
        variant === 'ghost' && 'hover:bg-subtle hover:text-fg',
        variant === 'card' && 'border border-border bg-card hover:bg-subtle hover:text-fg',
        variant === 'primary' && 'bg-primary text-on-primary hover:brightness-95',
        className,
      )}
    />
  ),
);

IconButton.displayName = 'IconButton';
