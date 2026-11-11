import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { Archive, ArchiveRestore, Pencil, ReceiptText, Trash2 } from 'lucide-react';
import {
  CardLimitBar,
  CardVisual,
  formatExpiry,
  isExpired,
  savedCardNumber,
} from '../../../components/Cards';
import { BrandLogo, brandLabels } from '../../../components/Icons/brands';
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
} from '../../../components/Shared';
import { TransactionRow } from '../../../components/Transactions';
import { useDashboard } from '../../../components/Dashboard';
import { formatMonthYear, fromApiDate, formatDayHeading } from '../../../helpers';
import { useInvalidateFinance, useTransactions } from '../../../hooks';
import { cardsServices } from '../../../services/cards-services';
import type { Card } from '../../../types/cards-types';

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

  const { transactions, isInitialLoading } = useTransactions({
    month: selectedMonth.month,
    year: selectedMonth.year,
    cardId: card.id,
  });
  const monthTotal = transactions.reduce((total, t) => total + t.value, 0);
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
      await invalidateFinance();
      toast.success(card.archived ? 'Cartão reativado' : 'Cartão arquivado');
    } catch {
      toast.error('Não foi possível atualizar o cartão');
    }
  }

  async function handleDelete() {
    try {
      await removeCard();
      await invalidateFinance();
      toast.success('Cartão excluído');
      setIsConfirmingDelete(false);
      onClose();
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

        <DrawerSection
          title={`Lançamentos de ${monthLabel}`}
          action={
            transactions.length > 0 && (
              <Money value={monthTotal} className="text-sm font-semibold text-fg" />
            )
          }
        >
          {isInitialLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="skeleton h-14" />
              ))}
            </div>
          )}
          {!isInitialLoading && transactions.length === 0 && (
            <EmptyState
              className="py-6"
              icon={<ReceiptText size={24} />}
              title="Nada neste mês"
              description="Os lançamentos feitos com este cartão aparecem aqui."
            />
          )}
          <div className="-mx-3 space-y-0.5">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                dateLabel={formatDayHeading(fromApiDate(transaction.date))}
                onClick={openTransactionDetail}
              />
            ))}
          </div>
        </DrawerSection>
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
    </>
  );
}
