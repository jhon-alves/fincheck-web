import { ReactNode } from 'react';
import { cn } from '../../helpers';

type BadgeTone = 'neutral' | 'income' | 'expense' | 'transfer' | 'warning' | 'primary';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-fg-soft',
  income: 'bg-income-soft text-income-strong',
  expense: 'bg-expense-soft text-expense-strong',
  transfer: 'bg-transfer-soft text-transfer-strong',
  warning: 'bg-warning-soft text-warning-strong',
  primary: 'bg-primary-soft text-primary-strong dark:text-primary',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
