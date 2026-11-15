import { cn } from '../../helpers';
import { MiniCard } from '../Cards/MiniCard';
import type { Transaction } from '../../types/transactions-types';
import { paymentMethodIcons, paymentMethodLabels } from './paymentMethods';

/** Forma de pagamento compacta: mini cartão + final, ou ícone + conta. */
export function PaymentInfo({
  transaction,
  className,
  detailed = false,
}: {
  transaction: Transaction;
  className?: string;
  /** Mostra também o nome do cartão. Pix e dinheiro sempre mostram a conta. */
  detailed?: boolean;
}) {
  const { card, paymentMethod, bankAccount, toBankAccount, type } = transaction;

  if (type === 'TRANSFER') {
    return (
      <span className={cn('inline-flex min-w-0 items-center gap-1 truncate', className)}>
        {bankAccount?.name} → {toBankAccount?.name}
      </span>
    );
  }

  if (card) {
    return (
      <span className={cn('inline-flex min-w-0 items-center gap-1.5', className)}>
        <MiniCard color={card.color} brand={card.brand} size="sm" />
        <span className="money truncate">
          {detailed ? `${card.name} · ` : ''}•••• {card.lastDigits}
        </span>
      </span>
    );
  }

  const Icon = paymentMethodIcons[paymentMethod];

  return (
    <span className={cn('inline-flex min-w-0 items-center gap-1', className)}>
      <Icon size={13} aria-hidden className="shrink-0" />
      <span className="truncate">
        {paymentMethod === 'ACCOUNT'
          ? (bankAccount?.name ?? paymentMethodLabels.ACCOUNT)
          : `${paymentMethodLabels[paymentMethod]}${bankAccount ? ` · ${bankAccount.name}` : ''}`}
      </span>
    </span>
  );
}
