import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  Pencil,
  Repeat,
  StickyNote,
  Trash2,
  Undo2,
} from 'lucide-react';
import { cn, describeRecurrence, formatDate, formatLongDay, fromApiDate } from '../../helpers';
import {
  useConfirmTransaction,
  useInstallmentGroup,
  useInvalidateFinance,
} from '../../hooks';
import { transactionsServices } from '../../services/transactions-services';
import type { InstallmentScope, Transaction } from '../../types/transactions-types';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';
import { CategoryIcon } from '../Icons/CategoryIcon';
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
  IconButton,
  Money,
  Tooltip,
} from '../Shared';
import { InstallmentScopeDialog } from './InstallmentScopeDialog';
import { PaymentInfo } from './PaymentInfo';
import {
  amountSign,
  amountToneClass,
  paidLabel,
  paymentMethodLabels,
  transactionTypeLabels,
} from './paymentMethods';

/** Detalhe de um lançamento (global: abre do extrato, calendário, cartões e Home). */
export function TransactionDetailDrawer() {
  const { transactionInDetail, closeTransactionDetail } = useDashboard();
  const [last, setLast] = useState<Transaction | null>(null);

  // Mantém o último lançamento na tela durante a animação de saída.
  if (transactionInDetail && transactionInDetail !== last) {
    setLast(transactionInDetail);
  }

  return (
    <Drawer open={!!transactionInDetail} onOpenChange={(open) => !open && closeTransactionDetail()}>
      <DrawerContent>{last && <TransactionDetail key={last.id} transaction={last} />}</DrawerContent>
    </Drawer>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 text-muted" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium break-words text-fg">{children}</dd>
      </div>
    </div>
  );
}

function TransactionDetail({ transaction }: { transaction: Transaction }) {
  const invalidateFinance = useInvalidateFinance();
  const { openEditTransaction, openTransactionDetail, closeTransactionDetail } = useDashboard();
  const [isPaid, setIsPaid] = useState(transaction.paid);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { installments, isLoading: isLoadingGroup } = useInstallmentGroup(
    transaction.installmentGroupId,
  );

  const date = fromApiDate(transaction.date);
  const isTransfer = transaction.type === 'TRANSFER';
  const isGroup = !!transaction.installmentGroupId;
  const isRecurring = !!transaction.recurringRuleId;
  const isScoped = isGroup || isRecurring;

  // Confirmar/desfazer com update otimista (PATCH /confirm): não destaca a
  // ocorrência da regra recorrente, ao contrário de editar "só esta".
  const { mutate: confirm, isPending: isTogglingPaid } = useConfirmTransaction();

  function togglePaid(paid: boolean) {
    setIsPaid(paid);
    confirm({ transaction, paid }, { onError: () => setIsPaid(!paid) });
  }

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: (scope: InstallmentScope) =>
      transactionsServices.removeTransaction({ id: transaction.id, scope }),
  });

  async function handleDelete(scope: InstallmentScope = 'one') {
    try {
      await remove(scope);
      await invalidateFinance();
      toast.success(
        scope === 'one' ? 'Lançamento excluído' : scope === 'all' ? 'Parcelamento excluído' : 'Parcelas excluídas',
      );
      setIsConfirmingDelete(false);
      closeTransactionDetail();
    } catch {
      toast.error('Não foi possível excluir o lançamento');
    }
  }

  const groupTotal = installments.reduce((total, item) => total + item.value, 0);
  const paidCount = installments.filter((item) => item.paid).length;

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{transaction.name}</DrawerTitle>
        <DrawerDescription>
          {transactionTypeLabels[transaction.type]}
          {transaction.category ? ` · ${transaction.category.name}` : ''}
        </DrawerDescription>
      </DrawerHeader>

      <DrawerBody className="space-y-6">
        <div className="flex items-center gap-4">
          <CategoryIcon
            type={transaction.type}
            icon={transaction.category?.icon}
            color={transaction.category?.color}
            size="lg"
          />
          <div className="min-w-0">
            <Money
              value={transaction.value}
              sign={amountSign[transaction.type]}
              className={cn('text-3xl font-semibold tracking-tight', amountToneClass[transaction.type])}
            />
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge tone={isPaid ? 'income' : 'warning'}>
                {isPaid ? <Check size={11} /> : <Clock3 size={11} />}
                {isRecurring && !isPaid ? 'Previsto' : paidLabel(transaction.type, isPaid)}
              </Badge>
              {isGroup && (
                <Badge tone="neutral" className="money">
                  Parcela {transaction.installmentNumber} de {transaction.installmentsTotal}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <dl className="divide-y divide-border rounded-2xl border border-border px-4">
          <InfoRow icon={<CalendarDays size={16} />} label="Data">
            {formatLongDay(date)} de {date.getFullYear()}
          </InfoRow>
          <InfoRow icon={<CheckCheck size={16} />} label={isTransfer ? 'Contas' : 'Forma de pagamento'}>
            <span className="flex flex-col gap-0.5">
              {!isTransfer && <span>{paymentMethodLabels[transaction.paymentMethod]}</span>}
              <PaymentInfo transaction={transaction} detailed className="text-fg-soft" />
            </span>
          </InfoRow>
          {transaction.recurringRule && (
            <InfoRow icon={<Repeat size={16} />} label="Recorrência">
              {describeRecurrence(transaction.recurringRule, transaction.occurrenceDate)}
              {transaction.recurringRule.autoConfirm && (
                <span className="font-normal text-muted"> · confirma sozinho</span>
              )}
              {!transaction.recurringRule.active && (
                <span className="font-normal text-muted"> · pausada</span>
              )}
              {transaction.isDetached && (
                <span className="block text-xs font-normal text-muted">
                  Esta ocorrência foi editada à parte.
                </span>
              )}
            </InfoRow>
          )}
          {transaction.notes && (
            <InfoRow icon={<StickyNote size={16} />} label="Observação">
              <span className="font-normal whitespace-pre-line text-fg-soft">{transaction.notes}</span>
            </InfoRow>
          )}
        </dl>

        {isGroup && (
          <DrawerSection
            title="Parcelamento"
            action={
              installments.length > 0 && (
                <span className="text-xs text-muted">
                  {paidCount} de {installments.length} pagas · total{' '}
                  <Money value={groupTotal} className="font-semibold text-fg" />
                </span>
              )
            }
          >
            {isLoadingGroup ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="skeleton h-10" />
                ))}
              </div>
            ) : (
              <ol className="relative space-y-1 before:absolute before:top-4 before:bottom-4 before:left-[15px] before:w-px before:bg-border">
                {installments.map((item) => {
                  const isCurrent = item.id === transaction.id;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => !isCurrent && openTransactionDetail(item)}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={cn(
                          'relative flex w-full items-center gap-3 rounded-xl py-1.5 pr-2 text-left text-sm transition-colors',
                          isCurrent ? 'bg-primary-soft' : 'hover:bg-subtle',
                        )}
                      >
                        <span
                          className={cn(
                            'relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold',
                            item.paid
                              ? 'border-income bg-income text-white'
                              : isCurrent
                                ? 'border-fg bg-card text-fg'
                                : 'border-border bg-card text-muted',
                          )}
                        >
                          {item.paid ? <Check size={14} strokeWidth={3} /> : item.installmentNumber}
                        </span>
                        <span className={cn('flex-1', isCurrent ? 'font-semibold text-fg' : 'text-fg-soft')}>
                          {item.installmentNumber}ª · {formatDate(fromApiDate(item.date))}
                        </span>
                        <Money
                          value={item.value}
                          className={cn('text-sm', isCurrent ? 'font-semibold text-fg' : 'text-muted')}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </DrawerSection>
        )}
      </DrawerBody>

      <DrawerFooter className="justify-between">
        <Tooltip label="Excluir">
          <IconButton
            aria-label="Excluir lançamento"
            onClick={() => setIsConfirmingDelete(true)}
            className="text-expense-strong hover:bg-expense-soft hover:text-expense-strong"
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
        <div className="flex gap-2">
          {!isTransfer && (
            <Button
              variant="secondary"
              onClick={() => togglePaid(!isPaid)}
              disabled={isTogglingPaid}
            >
              {isPaid ? <Undo2 size={16} /> : <Check size={16} />}
              {isPaid
                ? 'Marcar pendente'
                : isRecurring
                  ? transaction.type === 'INCOME'
                    ? 'Confirmar recebimento'
                    : 'Confirmar pagamento'
                  : transaction.type === 'INCOME'
                    ? 'Marcar recebido'
                    : 'Marcar como pago'}
            </Button>
          )}
          <Button onClick={() => openEditTransaction({ ...transaction, paid: isPaid })}>
            <Pencil size={16} /> Editar
          </Button>
        </div>
      </DrawerFooter>

      {isScoped ? (
        <InstallmentScopeDialog
          open={isConfirmingDelete}
          onOpenChange={setIsConfirmingDelete}
          transaction={transaction}
          action="delete"
          isLoading={isRemoving}
          onConfirm={handleDelete}
        />
      ) : (
        <ConfirmDialog
          open={isConfirmingDelete}
          onOpenChange={setIsConfirmingDelete}
          title={isTransfer ? 'Excluir esta transferência?' : 'Excluir este lançamento?'}
          description="Essa ação não pode ser desfeita."
          confirmLabel="Excluir"
          isLoading={isRemoving}
          onConfirm={() => handleDelete('one')}
        />
      )}
    </>
  );
}
