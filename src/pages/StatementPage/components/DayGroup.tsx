import { memo } from 'react';
import { Money } from '../../../components/Shared';
import { TransactionRow } from '../../../components/Transactions';
import { cn, formatDayHeading } from '../../../helpers';
import type { Transaction } from '../../../types/transactions-types';
import type { DayGroup as DayGroupData } from '../useStatementController';

interface DayGroupProps {
  group: DayGroupData;
  onOpen: (transaction: Transaction) => void;
}

/** Um dia do extrato: cabeçalho fixo (sticky) com o total e as linhas. */
export const DayGroup = memo(function DayGroup({ group, onOpen }: DayGroupProps) {
  const label = formatDayHeading(group.date);
  const headingId = `day-${group.key}`;

  return (
    <section aria-labelledby={headingId}>
      {/* top-6 = logo abaixo da máscara de 24px do <main>, então o cabeçalho
          nunca fica esmaecido quando gruda no topo */}
      <div className="sticky top-6 z-10 -mx-1 mb-1 flex items-center justify-between gap-3 rounded-xl bg-card/90 px-4 py-2 backdrop-blur-md">
        <h3 id={headingId} className="text-sm font-semibold text-fg">
          {label}
          {label === 'Hoje' || label === 'Ontem' ? (
            <span className="ml-1.5 font-normal text-muted">
              · {group.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}
            </span>
          ) : null}
        </h3>
        {group.total !== 0 && (
          <Money
            value={group.total}
            sign="auto"
            className={cn(
              'text-xs font-semibold',
              group.total < 0 ? 'text-fg-soft' : 'text-income-strong',
            )}
          />
        )}
      </div>
      <div className="space-y-0.5">
        {group.transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} onClick={onOpen} />
        ))}
      </div>
    </section>
  );
});
