import { ReactNode } from 'react';
import { cn } from '../../helpers';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="relative mb-1 grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary-strong">
          {icon}
          <span aria-hidden className="absolute -top-1 -right-1 size-3 rounded-full bg-primary" />
        </div>
      )}
      <p className="text-base font-semibold tracking-tight text-fg">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
