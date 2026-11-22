import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ReceiptText,
  Trash2,
} from 'lucide-react';
import { CardLimitBar } from './CardLimitBar';
import { CardVisual } from './CardVisual';
import { formatExpiry, isExpired, savedCardNumber } from './cardNumber';
import { PayInvoiceDialog } from './PayInvoiceDialog';
import { BrandLogo, brandLabels } from '../Icons/brands';
import {
  Badge,
  Button,
  ConfirmDialog,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSection,
  DrawerTitle,
  EmptyState,
  IconButton,
  Money,
  Tooltip,
} from '../Shared';
import { TransactionRow, TransactionRowSkeleton } from '../Transactions/TransactionRow';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';
import { formatDate, formatMonthYear, fromApiDate, formatDayHeading, toApiDate } from '../../helpers';
import { useCardInvoice, useInvalidateFinance, useTransactions } from '../../hooks';
import { cardsServices } from '../../services/cards-services';
import type { Card, CardInvoice, InvoiceRef } from '../../types/cards-types';

interface CardDetailsDrawerProps {
  open: boolean;
  card: Card | null;
  onClose: () => void;
  onEdit: (card: Card) => void;
}

export function CardDetailsDrawer({ open, card, onClose, onEdit }: CardDetailsDrawerProps) {
  return (
    <Drawer open={open && !!card} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent size="lg">
        {card && <CardDetails card={card} onClose={onClose} onEdit={onEdit} />}
      </DrawerContent>
    </Drawer>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-subtle px-3.5 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 truncate font-medium text-fg">{children}</dd>
    </div>
  );
}

function CardDetails({
  card,
  onClose,
  onEdit,
}: {
  card: Card;
  onClose: () => void;
  onEdit: (card: Card) => void;
}) {
  const { selectedMonth, openTransactionDetail } = useDashboard();
  const invalidateFinance = useInvalidateFinance();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const isCredit = card.kind === 'CREDIT';
  const today = toApiDate(new Date());

  // Crédito: abre na fatura atual (a que recebe as compras de hoje) e navega
  // de fatura em fatura. Débito: lançamentos do mês do header.
  const [invoiceRef, setInvoiceRef] = useState<InvoiceRef>({ purchaseDate: today });
  const { invoice, isLoading: isLoadingInvoice } = useCardInvoice(card.id, invoiceRef, isCredit);

  // Vencimento da fatura atual, para esconder o "Atual" quando as setas
  // voltam até ela (a comparação é pelo mês, sem esperar a fatura carregar).
  const [currentDueDate, setCurrentDueDate] = useState<string | null>(null);
  if ('purchaseDate' in invoiceRef && invoice && invoice.dueDate !== currentDueDate) {
    setCurrentDueDate(invoice.dueDate);
  }
  const isCurrentInvoice =
    'purchaseDate' in invoiceRef ||
    (currentDueDate !== null && invoiceRef.dueDate.slice(0, 7) === currentDueDate.slice(0, 7));

  const { transactions: cardTransactions, isInitialLoading, isPlaceholderData } = useTransactions(
    isCredit
      ? { cardId: card.id, from: invoice?.periodStart, to: invoice?.periodEnd }
      : { cardId: card.id, month: selectedMonth.month, year: selectedMonth.year },
    !isCredit || !!invoice,
  );
  // Pagamentos de fatura também têm o cartão, mas não são compras.
  const transactions = cardTransactions.filter((t) => t.type !== 'INVOICE_PAYMENT');
  // Ao trocar de fatura (ou de mês), a lista antiga fica como placeholder até a
  // nova chegar. Mostra o skeleton nesse meio, em vez de trocar de uma vez.
  const isLoadingPurchases =
    isInitialLoading || isPlaceholderData || (isCredit && (isLoadingInvoice || !invoice));
  const skeletonRows = Math.min(Math.max(transactions.length, 3), 6);
  const monthTotal = transactions.reduce((total, t) => total + t.value, 0);

  function goToInvoice(delta: number) {
    if (!invoice) return;
    const [year, month] = invoice.dueDate.split('-').map(Number);
    setInvoiceRef({ dueDate: toApiDate(new Date(year, month - 1 + delta, 1)) });
  }
  const monthLabel = formatMonthYear(new Date(selectedMonth.year, selectedMonth.month, 1));

  const { mutateAsync: toggleArchive, isPending: isArchiving } = useMutation({
    mutationFn: () =>
      cardsServices.updateCard({
        id: card.id,
        name: card.name,
        holderName: card.holderName,
        lastDigits: card.lastDigits,
        brand: card.brand,
        kind: card.kind,
        color: card.color,
        expMonth: card.expMonth,
        expYear: card.expYear,
        bankAccountId: card.bankAccountId,
        creditLimit: card.creditLimit,
        closingDay: card.closingDay,
        dueDay: card.dueDay,
        archived: !card.archived,
      }),
  });

  const { mutateAsync: removeCard, isPending: isRemoving } = useMutation({
    mutationFn: () => cardsServices.removeCard(card.id),
  });

  async function handleToggleArchive() {
    try {
      await toggleArchive();
      toast.success(card.archived ? 'Cartão reativado' : 'Cartão arquivado');
      void invalidateFinance();
    } catch {
      toast.error('Não foi possível atualizar o cartão');
    }
  }

  async function handleDelete() {
    try {
      await removeCard();
      toast.success('Cartão excluído');
      setIsConfirmingDelete(false);
      onClose();
      void invalidateFinance();
    } catch {
      toast.error('Não foi possível excluir o cartão');
    }
  }

  return (
    <>
      <DrawerHeader>
        <div className="flex items-center gap-2">
          <DrawerTitle>{card.name}</DrawerTitle>
          {card.archived && <Badge>Arquivado</Badge>}
          {isExpired(card.expMonth, card.expYear) && <Badge tone="warning">Vencido</Badge>}
        </div>
        <DrawerDescription>
          {card.kind === 'CREDIT' ? 'Crédito' : 'Débito'} · {brandLabels[card.brand]} ••••{' '}
          {card.lastDigits}
        </DrawerDescription>
      </DrawerHeader>

      <DrawerBody className="space-y-7">
        <div className="mx-auto w-full max-w-[340px]">
          <CardVisual
            tilt
            name={card.name}
            holderName={card.holderName}
            number={savedCardNumber(card.lastDigits, card.brand)}
            brand={card.brand}
            kind={card.kind}
            color={card.color}
            expiry={formatExpiry(card.expMonth, card.expYear)}
            dimmed={card.archived}
          />
        </div>

        {card.kind === 'CREDIT' && (
          <DrawerSection title="Limite">
            <div className="rounded-2xl border border-border p-4">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">Disponível</p>
                  <Money
                    value={card.availableLimit ?? 0}
                    className="text-2xl font-semibold tracking-tight text-fg"
                  />
                </div>
                <p className="text-right text-xs text-muted">
                  de <Money value={card.creditLimit ?? 0} className="font-medium text-fg-soft" />
                </p>
              </div>
              <CardLimitBar used={card.usedLimit ?? 0} limit={card.creditLimit ?? 0} />
              <p className="mt-2 text-xs text-muted">
                O limite usado inclui as parcelas futuras ainda não pagas.
              </p>
            </div>
          </DrawerSection>
        )}

        {isCredit && (
          <DrawerSection
            title={invoice ? `Fatura de ${formatMonthYear(fromApiDate(invoice.dueDate))}` : 'Fatura'}
            action={
              <div className="flex items-center gap-1">
                {!isCurrentInvoice && (
                  <Button size="sm" variant="ghost" onClick={() => setInvoiceRef({ purchaseDate: today })}>
                    Atual
                  </Button>
                )}
                <IconButton size="sm" aria-label="Fatura anterior" onClick={() => goToInvoice(-1)}>
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton size="sm" aria-label="Próxima fatura" onClick={() => goToInvoice(1)}>
                  <ChevronRight size={16} />
                </IconButton>
              </div>
            }
          >
            {isLoadingInvoice || !invoice ? (
              <div className="skeleton h-[104px]" />
            ) : (
              <InvoiceSummary
                invoice={invoice}
                today={today}
                onPay={() => setIsInvoiceOpen(true)}
              />
            )}

            <div className="mt-3">
              {isLoadingPurchases && (
                <div className="-mx-3 space-y-0.5" aria-busy>
                  {Array.from({ length: skeletonRows }, (_, i) => (
                    <TransactionRowSkeleton key={i} />
                  ))}
                </div>
              )}
              {!isLoadingPurchases && transactions.length === 0 && (
                <p className="py-4 text-center text-sm text-muted">Nenhuma compra nesta fatura.</p>
              )}
              <div className="-mx-3 space-y-0.5">
                {!isLoadingPurchases && transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    dateLabel={formatDayHeading(fromApiDate(transaction.date))}
                    onClick={openTransactionDetail}
                  />
                ))}
              </div>
            </div>
          </DrawerSection>
        )}

        <DrawerSection title="Dados do cartão">
          <dl className="grid grid-cols-2 gap-2">
            <InfoItem label="Bandeira">
              <span className="flex items-center gap-2">
                <BrandLogo brand={card.brand} className="h-4" /> {brandLabels[card.brand]}
              </span>
            </InfoItem>
            <InfoItem label="Final">
              <span className="money">•••• {card.lastDigits}</span>
            </InfoItem>
            <InfoItem label="Validade">
              <span className="money">{formatExpiry(card.expMonth, card.expYear)}</span>
            </InfoItem>
            <InfoItem label={card.kind === 'CREDIT' ? 'Paga com' : 'Debita de'}>
              {card.bankAccount?.name ?? '—'}
            </InfoItem>
            {card.kind === 'CREDIT' && (
              <>
                <InfoItem label="Fechamento">Dia {card.closingDay}</InfoItem>
                <InfoItem label="Vencimento">Dia {card.dueDay}</InfoItem>
              </>
            )}
          </dl>
        </DrawerSection>

        {!isCredit && (
          <DrawerSection
            title={`Lançamentos de ${monthLabel}`}
            action={
              transactions.length > 0 && (
                <Money value={monthTotal} className="text-sm font-semibold text-fg" />
              )
            }
          >
            {isLoadingPurchases && (
              <div className="-mx-3 space-y-0.5" aria-busy>
                {Array.from({ length: skeletonRows }, (_, i) => (
                  <TransactionRowSkeleton key={i} />
                ))}
              </div>
            )}
            {!isLoadingPurchases && transactions.length === 0 && (
              <EmptyState
                className="py-6"
                icon={<ReceiptText size={24} />}
                title="Nada neste mês"
                description="Os lançamentos feitos com este cartão aparecem aqui."
              />
            )}
            <div className="-mx-3 space-y-0.5">
              {!isLoadingPurchases && transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  dateLabel={formatDayHeading(fromApiDate(transaction.date))}
                  onClick={openTransactionDetail}
                />
              ))}
            </div>
          </DrawerSection>
        )}
      </DrawerBody>

      <DrawerFooter className="justify-between">
        <Tooltip label="Excluir cartão">
          <IconButton
            aria-label="Excluir cartão"
            onClick={() => setIsConfirmingDelete(true)}
            className="text-expense-strong hover:bg-expense-soft hover:text-expense-strong"
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleToggleArchive} isLoading={isArchiving}>
            {card.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            {card.archived ? 'Reativar' : 'Arquivar'}
          </Button>
          <Button onClick={() => onEdit(card)}>
            <Pencil size={16} /> Editar
          </Button>
        </div>
      </DrawerFooter>

      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title="Excluir este cartão?"
        description="Todos os lançamentos feitos com ele também serão excluídos. Para manter o histórico, arquive o cartão em vez de excluir."
        confirmLabel="Excluir"
        isLoading={isRemoving}
        onConfirm={handleDelete}
      />

      {isCredit && (
        <PayInvoiceDialog
          open={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          cardId={card.id}
          invoiceRef={invoiceRef}
        />
      )}
    </>
  );
}

/**
 * Status da fatura: aberta até o dia do fechamento (ainda recebe compras),
 * fechada depois disso enquanto não é paga, e paga quando não sobra nada.
 */
function invoiceStatus(invoice: CardInvoice, today: string) {
  if (today < invoice.closingDate) {
    return { label: 'Aberta', tone: 'primary' as const };
  }
  if (invoice.total === 0) {
    return { label: 'Sem compras', tone: 'neutral' as const };
  }
  if (invoice.pendingTotal === 0) {
    return { label: 'Paga', tone: 'income' as const };
  }
  return { label: 'Fechada', tone: 'warning' as const };
}

function InvoiceSummary({
  invoice,
  today,
  onPay,
}: {
  invoice: CardInvoice;
  today: string;
  onPay: () => void;
}) {
  const status = invoiceStatus(invoice, today);
  const closing = formatDate(fromApiDate(invoice.closingDate));
  const due = formatDate(fromApiDate(invoice.dueDate));
  const isOpen = status.label === 'Aberta';

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className="truncate text-xs text-muted">
            {isOpen ? `fecha ${closing}` : `fechou ${closing}`} · vence {due}
          </span>
        </div>
        <Money value={invoice.total} className="mt-1.5 block text-2xl font-semibold tracking-tight text-fg" />
        {invoice.pendingTotal > 0 && invoice.paidTotal > 0 && (
          <p className="mt-0.5 text-xs font-medium text-warning-strong">
            Falta pagar <Money value={invoice.pendingTotal} />
          </p>
        )}
      </div>
      {invoice.total > 0 && (
        <Button
          size="sm"
          variant={invoice.pendingTotal > 0 && !isOpen ? 'primary' : 'secondary'}
          onClick={onPay}
        >
          {invoice.pendingTotal > 0 ? 'Pagar fatura' : 'Ver pagamento'}
        </Button>
      )}
    </div>
  );
}
