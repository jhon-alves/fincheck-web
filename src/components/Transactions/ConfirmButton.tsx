import { Check } from 'lucide-react';
import { cn } from '../../helpers';
import { useConfirmTransaction } from '../../hooks/useConfirmTransaction';
import type { Transaction } from '../../types/transactions-types';

/** "Confirmar" de uma ocorrência prevista cuja data já chegou. */
export function ConfirmButton({
  transaction,
  className,
}: {
  transaction: Transaction;
  className?: string;
}) {
  const { mutate, isPending } = useConfirmTransaction();
  const label = transaction.type === 'INCOME' ? 'Confirmar recebimento' : 'Confirmar pagamento';

  return (
    <button
      type="button"
      onClick={() => mutate({ transaction, paid: true })}
      disabled={isPending}
      aria-label={`${label}: ${transaction.name}`}
      title={label}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-on-primary transition-[filter,opacity] outline-none hover:brightness-95 focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-60',
        className,
      )}
    >
      <Check size={13} strokeWidth={3} aria-hidden />
      Confirmar
    </button>
  );
}
