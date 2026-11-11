import { memo } from 'react';
import { Clock3 } from 'lucide-react';
import { cn, isDueOrPast } from '../../helpers';
import { CategoryIcon } from '../Icons/CategoryIcon';
import { Badge } from '../Shared/Badge';
import { Money } from '../Shared/Money';
import type { Transaction } from '../../types/transactions-types';
import { ConfirmButton } from './ConfirmButton';
import { PaymentInfo } from './PaymentInfo';
import { RecurringBadge } from './RecurringBadge';
import { amountSign, amountToneClass, paidLabel } from './paymentMethods';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
  /** Mostra a data na linha (listas que não agrupam por dia). */
  dateLabel?: string;
  /** "3/10" (padrão) ou "Parcela 3 de 10". */
  installmentLabel?: 'short' | 'long';
  /** Mostra "Confirmar" nas ocorrências recorrentes que já venceram. */
  showConfirm?: boolean;
  className?: string;
}

export const TransactionRow = memo(function TransactionRow({
  transaction,
  onClick,
  dateLabel,
  installmentLabel = 'short',
  showConfirm = true,
  className,
}: TransactionRowProps) {
  const { type, name, value, paid, installmentNumber, installmentsTotal, category } = transaction;
  const isPending = !paid;
  const isRecurring = !!transaction.recurringRuleId;
  const canConfirm = showConfirm && isRecurring && !paid && isDueOrPast(transaction.date);
  const subtitle = type === 'TRANSFER' ? 'Transferência' : (category?.name ?? 'Sem categoria');

  // O "Confirmar" fica fora do botão principal (não pode haver botão dentro
  // de botão), na mesma linha.
  return (
    <div
      className={cn(
        'group flex w-full items-center rounded-2xl transition-colors hover:bg-subtle',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onClick?.(transaction)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-2.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <CategoryIcon
          type={type}
          icon={category?.icon}
          color={category?.color}
          className={cn(isPending && 'opacity-60')}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className={cn('truncate font-medium text-fg', isPending && 'text-fg-soft')}>
              {name}
            </span>
            {isRecurring && <RecurringBadge />}
            {installmentsTotal && installmentNumber && (
              <Badge tone="neutral" className="money">
                {installmentLabel === 'long'
                  ? `Parcela ${installmentNumber} de ${installmentsTotal}`
                  : `${installmentNumber}/${installmentsTotal}`}
              </Badge>
            )}
          </div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
            {dateLabel && <span className="shrink-0">{dateLabel} ·</span>}
            <span className="shrink-0 truncate">{subtitle}</span>
            <span aria-hidden className="shrink-0">·</span>
            <PaymentInfo transaction={transaction} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <Money
            value={value}
            sign={amountSign[type]}
            className={cn('font-semibold', amountToneClass[type], isPending && 'opacity-70')}
          />
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-medium',
              isPending ? 'text-warning-strong' : 'text-muted',
            )}
          >
            {isPending && <Clock3 size={11} aria-hidden />}
            {isRecurring && !paid ? 'Previsto' : paidLabel(type, paid)}
          </span>
        </div>
      </button>
      {canConfirm && <ConfirmButton transaction={transaction} className="mr-2" />}
    </div>
  );
});
