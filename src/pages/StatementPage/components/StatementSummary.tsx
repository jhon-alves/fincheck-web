import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';
import { Card, Money } from '../../../components/Shared';
import { cn } from '../../../helpers';

interface StatementSummaryProps {
  income: number;
  expense: number;
  balance: number;
  isLoading: boolean;
}

export function StatementSummary({ income, expense, balance, isLoading }: StatementSummaryProps) {
  const items = [
    {
      label: 'Entradas',
      value: income,
      icon: ArrowDownLeft,
      tone: 'bg-income-soft text-income-strong',
      valueClass: 'text-fg',
    },
    {
      label: 'Saídas',
      value: expense,
      icon: ArrowUpRight,
      tone: 'bg-expense-soft text-expense-strong',
      valueClass: 'text-fg',
    },
    {
      label: 'Saldo do período',
      value: balance,
      icon: Scale,
      tone: 'bg-primary-soft text-primary-strong dark:text-primary',
      valueClass: balance < 0 ? 'text-expense-strong' : 'text-fg',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, index) => (
        <Card
          key={item.label}
          className={cn('flex items-center gap-3 p-3.5 sm:p-4', index === 2 && 'col-span-2 sm:col-span-1')}
        >
          <span className={cn('hidden size-10 shrink-0 place-items-center rounded-2xl sm:grid', item.tone)}>
            <item.icon size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted">{item.label}</p>
            {isLoading ? (
              <div className="skeleton mt-1 h-6 w-28" />
            ) : (
              <Money
                value={item.value}
                sign={item.label === 'Saldo do período' ? 'auto' : undefined}
                className={cn('block truncate text-base font-semibold tracking-tight sm:text-lg', item.valueClass)}
              />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
