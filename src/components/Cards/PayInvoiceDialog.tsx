import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { Check, Undo2 } from 'lucide-react';
import { apiErrorMessage, formatDate, fromApiDate, toApiDate } from '../../helpers';
import { useBankAccounts, useCardInvoice, useCards, useInvalidateFinance } from '../../hooks';
import { cardsServices } from '../../services/cards-services';
import { transactionsServices } from '../../services/transactions-services';
import type { InvoiceRef } from '../../types/cards-types';
import { Button } from '../Shared/Button';
import { DatePickerInput } from '../Shared/DatePickerInput';
import { Modal } from '../Shared/Modal';
import { Money } from '../Shared/Money';
import { Select } from '../Shared/Select';

interface PayInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  cardId: string;
  /** Qual fatura: pelo mês do vencimento ou pela data de uma compra. */
  invoiceRef: InvoiceRef;
  /** Depois de pagar ou desfazer (ex.: fechar o detalhe da compra, que ficou velho). */
  onChange?: () => void;
}

/**
 * Pagar fatura: escolhe a conta e a data, e a API cria o pagamento (que tira o
 * valor da conta) e marca as compras da fatura como pagas. Se a fatura já está
 * paga, mostra os pagamentos com a opção de desfazer.
 */
export function PayInvoiceDialog({ open, onClose, cardId, invoiceRef, onChange }: PayInvoiceDialogProps) {
  const { cards } = useCards({ refetchOnMount: false });
  const card = cards.find((item) => item.id === cardId);

  return (
    <Modal open={open} onClose={onClose} title={card ? `Fatura ${card.name}` : 'Fatura'}>
      {open && (
        <InvoiceContent
          cardId={cardId}
          defaultAccountId={card?.bankAccountId ?? ''}
          invoiceRef={invoiceRef}
          onClose={onClose}
          onChange={onChange}
        />
      )}
    </Modal>
  );
}

function InvoiceContent({
  cardId,
  defaultAccountId,
  invoiceRef,
  onClose,
  onChange,
}: {
  cardId: string;
  defaultAccountId: string;
  invoiceRef: InvoiceRef;
  onClose: () => void;
  onChange?: () => void;
}) {
  const { invoice, isLoading } = useCardInvoice(cardId, invoiceRef);
  const { accounts } = useBankAccounts({ refetchOnMount: false });
  const invalidateFinance = useInvalidateFinance();
  const [bankAccountId, setBankAccountId] = useState(defaultAccountId);
  const [date, setDate] = useState(() => new Date());

  const { mutateAsync: pay, isPending: isPaying } = useMutation({
    mutationFn: cardsServices.payInvoice,
  });
  const { mutateAsync: undo, isPending: isUndoing } = useMutation({
    mutationFn: (paymentId: string) =>
      transactionsServices.removeTransaction({ id: paymentId, scope: 'one' }),
  });

  if (isLoading || !invoice) {
    return (
      <div className="space-y-3" aria-busy>
        <div className="skeleton h-24" />
        <div className="skeleton h-[52px]" />
        <div className="skeleton h-[52px]" />
      </div>
    );
  }

  const dueDate = fromApiDate(invoice.dueDate);
  const period = `compras de ${formatDate(fromApiDate(invoice.periodStart))} a ${formatDate(fromApiDate(invoice.periodEnd))}`;
  const accountName = accounts.find((account) => account.id === bankAccountId)?.name;

  async function handlePay() {
    try {
      await pay({ cardId, dueDate: invoice!.dueDate, bankAccountId, date: toApiDate(date) });
      toast.success(`Fatura paga${accountName ? ` com ${accountName}` : ''}!`);
      onClose();
      onChange?.();
      void invalidateFinance();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Não foi possível pagar a fatura'));
    }
  }

  async function handleUndo(paymentId: string) {
    try {
      await undo(paymentId);
      toast.success('Pagamento desfeito. As compras voltaram para pendente.');
      onChange?.();
      void invalidateFinance();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Não foi possível desfazer o pagamento'));
    }
  }

  if (invoice.total === 0) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-fg-soft">
          Nenhuma compra na fatura que vence em {formatDate(dueDate)} ({period}).
        </p>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  const isPaid = invoice.pendingTotal === 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle p-4">
        <p className="text-xs text-muted">
          Vence em {formatDate(dueDate)} · {period}
        </p>
        <Money
          value={isPaid ? invoice.total : invoice.pendingTotal}
          className="mt-1 block text-3xl font-semibold tracking-tight text-fg"
        />
        <p className="mt-1 text-xs text-muted">
          {isPaid ? (
            <span className="inline-flex items-center gap-1 font-medium text-income-strong">
              <Check size={13} aria-hidden /> Fatura paga
            </span>
          ) : (
            <>
              {invoice.pendingCount} {invoice.pendingCount === 1 ? 'compra pendente' : 'compras pendentes'}
              {invoice.paidTotal > 0 && (
                <>
                  {' '}· <Money value={invoice.paidTotal} /> já pago
                </>
              )}
            </>
          )}
        </p>
      </div>

      {invoice.payments.length > 0 && (
        <ul className="space-y-1.5">
          {invoice.payments.map((payment) => (
            <li key={payment.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium text-fg">
                  Pago em {formatDate(fromApiDate(payment.date))}
                </p>
                <p className="truncate text-xs text-muted">{payment.bankAccount?.name ?? 'Conta removida'}</p>
              </div>
              <Money value={payment.value} className="text-sm font-semibold text-fg" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUndo(payment.id)}
                disabled={isUndoing}
                aria-label="Desfazer este pagamento"
              >
                <Undo2 size={15} /> Desfazer
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!isPaid && (
        <>
          <div className="space-y-3">
            <Select
              placeholder="Pagar com a conta"
              value={bankAccountId || undefined}
              onChange={setBankAccountId}
              options={accounts.map((account) => ({ value: account.id, label: account.name }))}
            />
            <DatePickerInput label="Data do pagamento" value={date} onChange={setDate} />
          </div>
          <p className="text-xs text-muted">
            As compras ficam como pagas e o valor sai do saldo da conta. Para desfazer, exclua o
            pagamento.
          </p>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {isPaid ? 'Fechar' : 'Cancelar'}
        </Button>
        {!isPaid && (
          <Button onClick={handlePay} isLoading={isPaying} disabled={!bankAccountId}>
            Pagar <Money value={invoice.pendingTotal} />
          </Button>
        )}
      </div>
    </div>
  );
}
