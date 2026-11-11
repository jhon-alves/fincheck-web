import { CalendarCheck2, CreditCard } from 'lucide-react';
import { EmptyState, Money } from '../../../components/Shared';
import { MiniCard } from '../../../components/Cards';
import { CategoryIcon } from '../../../components/Icons';
import { useDashboard } from '../../../components/Dashboard';
import { cn, formatDate, formatRelativeDay, fromApiDate } from '../../../helpers';
import type { DashboardSummary } from '../../../types/dashboard-types';

type UpcomingItem =
  | { kind: 'invoice'; date: Date; invoice: DashboardSummary['upcoming']['invoices'][number] }
  | { kind: 'transaction'; date: Date; transaction: DashboardSummary['upcoming']['transactions'][number] };

export function UpcomingList({
  upcoming,
  isLoading,
}: {
  upcoming: DashboardSummary['upcoming'] | undefined;
  isLoading: boolean;
}) {
  const { openTransactionDetail } = useDashboard();

  if (isLoading || !upcoming) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton h-12" />
        ))}
      </div>
    );
  }

  const items: UpcomingItem[] = [
    ...upcoming.invoices.map((invoice) => ({
      kind: 'invoice' as const,
      date: fromApiDate(invoice.dueDate),
      invoice,
    })),
    ...upcoming.transactions.map((transaction) => ({
      kind: 'transaction' as const,
      date: fromApiDate(transaction.date),
      transaction,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (items.length === 0) {
    return (
      <EmptyState
        className="py-6"
        icon={<CalendarCheck2 size={24} />}
        title="Semana tranquila"
        description="Nada pendente nem fatura vencendo nos próximos 7 dias."
      />
    );
  }

  return (
    <ul className="-mx-2 space-y-0.5">
      {items.map((item) => {
        const relative = formatRelativeDay(item.date);
        const isSoon = relative === 'hoje' || relative === 'amanhã';

        if (item.kind === 'invoice') {
          return (
            <li
              key={`invoice-${item.invoice.cardId}-${item.invoice.dueDate}`}
              className="flex items-center gap-3 rounded-xl px-2 py-2"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-warning-soft text-warning-strong">
                <CreditCard size={18} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-fg">
                  Fatura {item.invoice.cardName}
                  <MiniCard color={item.invoice.color} brand={item.invoice.brand} className="h-4 w-6 rounded-[3px] p-[2px] [&>span]:h-1.5" />
                </p>
                <p className="text-xs text-muted">
                  vence {relative} · {formatDate(item.date)}
                </p>
              </div>
              <Money value={item.invoice.amount} className="text-sm font-semibold text-fg" />
            </li>
          );
        }

        const { transaction } = item;
        return (
          <li key={transaction.id}>
            <button
              type="button"
              onClick={() => openTransactionDetail(transaction)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-subtle"
            >
              <CategoryIcon
                type={transaction.type}
                icon={transaction.category?.icon}
                color={transaction.category?.color}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">
                  {transaction.name}
                  {transaction.installmentsTotal && (
                    <span className="money ml-1.5 text-xs font-normal text-muted">
                      {transaction.installmentNumber}/{transaction.installmentsTotal}
                    </span>
                  )}
                </p>
                <p className={cn('text-xs', isSoon ? 'font-medium text-warning-strong' : 'text-muted')}>
                  {relative} · {formatDate(item.date)}
                </p>
              </div>
              <Money
                value={transaction.value}
                sign={transaction.type === 'INCOME' ? '+' : '-'}
                className={cn(
                  'text-sm font-semibold',
                  transaction.type === 'INCOME' ? 'text-income-strong' : 'text-fg',
                )}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
