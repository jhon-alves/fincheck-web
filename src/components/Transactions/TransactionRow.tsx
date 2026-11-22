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
  // Compra no crédito não é paga sozinha: ela faz parte da fatura, que tem o
  // próprio status (aberta, fechada, paga). Por isso não mostra "Pendente".
  const isCreditPurchase = transaction.paymentMethod === 'CREDIT_CARD' && type === 'EXPENSE';
  const isPending = !paid && !isCreditPurchase;
  const isRecurring = !!transaction.recurringRuleId;
  // Crédito é pago pela fatura, não pelo "Confirmar".
  const canConfirm =
    showConfirm &&
    isRecurring &&
    !paid &&
    transaction.paymentMethod !== 'CREDIT_CARD' &&
    isDueOrPast(transaction.date);
  const subtitle =
    type === 'TRANSFER'
      ? 'Transferência'
      : type === 'INVOICE_PAYMENT'
        ? 'Pagamento de fatura'
        : (category?.name ?? 'Sem categoria');

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
          {!isCreditPurchase && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-medium',
                isPending ? 'text-warning-strong' : 'text-muted',
              )}
            >
              {isPending && <Clock3 size={11} aria-hidden />}
              {isRecurring && !paid ? 'Previsto' : paidLabel(type, paid)}
            </span>
          )}
        </div>
      </button>
      {canConfirm && <ConfirmButton transaction={transaction} className="mr-2" />}
    </div>
  );
});

/** Linha "fantasma" com as mesmas medidas da TransactionRow, para carregamento. */
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5" aria-hidden>
      <div className="skeleton size-10 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton h-4 w-20" />
    </div>
  );
}
