import { Repeat } from 'lucide-react';
import { cn } from '../../helpers';

/** Selo ↻ dos lançamentos recorrentes. */
export function RecurringBadge({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      title={label ?? 'Lançamento recorrente'}
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-transfer-soft px-1.5 text-[11px] font-semibold text-transfer-strong',
        className,
      )}
    >
      <Repeat size={11} strokeWidth={2.4} aria-hidden />
      <span className={label ? undefined : 'sr-only'}>{label ?? 'Recorrente'}</span>
    </span>
  );
}
