import { ArrowDownLeft, ArrowUpRight, Scale, type LucideIcon } from 'lucide-react';
import { Money } from '../../../components/Shared';
import { cn } from '../../../helpers';
import type { DashboardSummary } from '../../../types/dashboard-types';

interface YearSummaryProps {
  totals?: DashboardSummary['yearTotals'];
  isLoading: boolean;
}

function Stat({
  label,
  value,
  icon: Icon,
  iconTone,
  valueTone = 'text-fg',
  signed = false,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconTone: string;
  valueTone?: string;
  signed?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-subtle p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted">{label}</span>
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-xl', iconTone)}>
          <Icon size={16} aria-hidden />
        </span>
      </div>
      <Money
        value={value}
        sign={signed ? (value > 0 ? '+' : 'auto') : undefined}
        className={cn('block truncate text-xl font-semibold tracking-tight', valueTone)}
      />
    </div>
  );
}

/** Entradas, saídas e o que sobrou (ou faltou) no ano do mês selecionado. */
export function YearSummary({ totals, isLoading }: YearSummaryProps) {
  if (isLoading || !totals) {
    return (
      <div className="grid gap-3 sm:grid-cols-3" aria-busy>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton h-[104px]" />
        ))}
      </div>
    );
  }

  const { income, expense, balance } = totals;
  const isPositive = balance >= 0;
  const spentShare = income > 0 ? (expense / income) * 100 : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Entradas no ano"
          value={income}
          icon={ArrowDownLeft}
          iconTone="bg-income-soft text-income-strong"
        />
        <Stat
          label="Saídas no ano"
          value={expense}
          icon={ArrowUpRight}
          iconTone="bg-expense-soft text-expense-strong"
        />
        <Stat
          label={isPositive ? 'Sobrou no ano' : 'Faltou no ano'}
          value={balance}
          icon={Scale}
          iconTone={isPositive ? 'bg-income-soft text-income-strong' : 'bg-expense-soft text-expense-strong'}
          valueTone={isPositive ? 'text-income-strong' : 'text-expense-strong'}
          signed
        />
      </div>

      {spentShare !== null && (
        <div>
          <div
            className="h-2 overflow-hidden rounded-full bg-subtle"
            role="img"
            aria-label={`As saídas equivalem a ${spentShare.toFixed(0)}% das entradas do ano`}
          >
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-500',
                spentShare > 100 ? 'bg-expense' : 'bg-expense/80',
              )}
              style={{ width: `${Math.min(100, spentShare)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            As saídas equivalem a{' '}
            <span className="money font-semibold text-fg-soft">{spentShare.toFixed(0)}%</span> das
            entradas do ano.
          </p>
        </div>
      )}
    </div>
  );
}
