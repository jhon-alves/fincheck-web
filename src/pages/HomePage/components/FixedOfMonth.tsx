import { Check, Repeat } from 'lucide-react';
import { EmptyState, Money } from '../../../components/Shared';
import { CategoryIcon } from '../../../components/Icons';
import { ConfirmButton } from '../../../components/Transactions';
import { useDashboard } from '../../../components/Dashboard';
import { cn, formatRelativeDay, fromApiDate, isDueOrPast } from '../../../helpers';
import type { DashboardSummary } from '../../../types/dashboard-types';

/** Ocorrências recorrentes do mês: confirmadas, previstas e as que já venceram. */
export function FixedOfMonth({
  fixed,
  isLoading,
}: {
  fixed: DashboardSummary['fixed'] | undefined;
  isLoading: boolean;
}) {
  const { openTransactionDetail } = useDashboard();

  if (isLoading || !fixed) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton h-12" />
        ))}
      </div>
    );
  }

  if (fixed.transactions.length === 0) {
    return (
      <EmptyState
        className="py-6"
        icon={<Repeat size={24} />}
        title="Nenhum fixo neste mês"
        description="Marque “Repetir” ao lançar salário, aluguel ou assinaturas."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-income-soft px-3 py-2">
          <p className="text-[11px] text-income-strong">Entradas fixas</p>
          <Money value={fixed.income} className="text-sm font-semibold text-fg" />
        </div>
        <div className="rounded-xl bg-expense-soft px-3 py-2">
          <p className="text-[11px] text-expense-strong">Saídas fixas</p>
          <Money value={fixed.expense} className="text-sm font-semibold text-fg" />
        </div>
      </div>

      <ul className="-mx-2 max-h-80 space-y-0.5 overflow-y-auto">
        {fixed.transactions.map((transaction) => {
          const date = fromApiDate(transaction.date);
          const canConfirm = !transaction.paid && isDueOrPast(transaction.date);
          const isIncome = transaction.type === 'INCOME';

          return (
            <li key={transaction.id} className="flex items-center rounded-xl hover:bg-subtle">
              <button
                type="button"
                onClick={() => openTransactionDetail(transaction)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left outline-none focus-visible:ring-4 focus-visible:ring-ring"
              >
                <CategoryIcon
                  type={transaction.type}
                  icon={transaction.category?.icon}
                  color={transaction.category?.color}
                  className={cn(!transaction.paid && 'opacity-70')}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{transaction.name}</p>
                  <p className="text-xs text-muted">
                    dia {date.getDate()} · {formatRelativeDay(date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <Money
                    value={transaction.value}
                    sign={isIncome ? '+' : '-'}
                    className={cn('text-sm font-semibold', isIncome ? 'text-income-strong' : 'text-fg')}
                  />
                  {transaction.paid ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-income-strong">
                      <Check size={11} strokeWidth={3} /> Confirmado
                    </span>
                  ) : (
                    !canConfirm && <span className="text-[11px] text-muted">Previsto</span>
                  )}
                </div>
              </button>
              {canConfirm && <ConfirmButton transaction={transaction} className="mr-1" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
