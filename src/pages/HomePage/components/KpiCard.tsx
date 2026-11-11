import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card, Money } from '../../../components/Shared';
import { cn, percentChange } from '../../../helpers';

interface KpiCardProps {
  label: string;
  value: number;
  previous: number;
  icon: LucideIcon;
  iconTone: string;
  /** Para saídas e faturas, subir é ruim. */
  higherIsBetter: boolean;
  isLoading: boolean;
}

export function KpiCard({
  label,
  value,
  previous,
  icon: Icon,
  iconTone,
  higherIsBetter,
  isLoading,
}: KpiCardProps) {
  const change = percentChange(value, previous);
  const isUp = (change ?? 0) > 0;
  const isGood = change === null || change === 0 ? null : isUp === higherIsBetter;

  return (
    <Card className="flex min-w-0 flex-col justify-between gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted">{label}</span>
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-xl', iconTone)}>
          <Icon size={16} aria-hidden />
        </span>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="skeleton h-7 w-28" />
          <div className="skeleton h-4 w-20" />
        </div>
      ) : (
        <div className="min-w-0">
          <Money
            value={value}
            sign={label === 'Economia' ? 'auto' : undefined}
            className="block truncate text-xl font-semibold tracking-tight text-fg"
          />
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            {change === null ? (
              'sem base no mês anterior'
            ) : (
              <>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-semibold',
                    isGood === null
                      ? 'text-muted'
                      : isGood
                        ? 'text-income-strong'
                        : 'text-expense-strong',
                  )}
                >
                  {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span className="money">{Math.abs(change).toFixed(0)}%</span>
                </span>
                vs. mês anterior
              </>
            )}
          </p>
        </div>
      )}
    </Card>
  );
}
