import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleStop,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  Repeat,
  Scale,
  Trash2,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DropdownMenu,
  EmptyState,
  Money,
} from '../../../components/Shared';
import { CategoryIcon } from '../../../components/Icons';
import { MiniCard } from '../../../components/Cards';
import { paymentMethodIcons, paymentMethodLabels } from '../../../components/Transactions';
import { useDashboard } from '../../../components/Dashboard';
import {
  apiErrorMessage,
  cn,
  describeRecurrence,
  formatDate,
  formatRelativeDay,
  fromApiDate,
} from '../../../helpers';
import { useInvalidateFinance, useRecurringRules } from '../../../hooks';
import { recurringServices } from '../../../services/recurring-services';
import type { RecurringRule } from '../../../types/recurring-types';

const STATUS_LABEL = { ACTIVE: 'Ativa', PAUSED: 'Pausada', ENDED: 'Encerrada' } as const;

function RulePayment({ rule }: { rule: RecurringRule }) {
  if (rule.card) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <MiniCard color={rule.card.color} brand={rule.card.brand} className="h-4 w-6 rounded-[3px] p-[2px] [&>span]:h-1.5" />
        <span className="money">•••• {rule.card.lastDigits}</span>
      </span>
    );
  }

  const Icon = paymentMethodIcons[rule.paymentMethod];
  return (
    <span className="inline-flex items-center gap-1">
      <Icon size={13} aria-hidden />
      {rule.paymentMethod === 'ACCOUNT'
        ? (rule.bankAccount?.name ?? 'Conta')
        : `${paymentMethodLabels[rule.paymentMethod]}${rule.bankAccount ? ` · ${rule.bankAccount.name}` : ''}`}
    </span>
  );
}

type PendingAction = { rule: RecurringRule; kind: 'end' | 'delete' } | null;

/** Aba "Recorrentes" do extrato: as regras (moldes) e o que elas somam por mês. */
export function RecurringRulesPanel() {
  const { rules, isLoading } = useRecurringRules();
  const { openTransactionDetail, openEditTransaction, openNewTransaction } = useDashboard();
  const invalidateFinance = useInvalidateFinance();
  const [pending, setPending] = useState<PendingAction>(null);

  const active = rules.filter((rule) => rule.status === 'ACTIVE');
  const monthlyIncome = active
    .filter((rule) => rule.type === 'INCOME')
    .reduce((total, rule) => total + rule.monthlyEquivalent, 0);
  const monthlyExpense = active
    .filter((rule) => rule.type === 'EXPENSE')
    .reduce((total, rule) => total + rule.monthlyEquivalent, 0);

  const { mutateAsync: changeStatus, isPending: isChanging } = useMutation({
    mutationFn: recurringServices.changeStatus,
  });
  const { mutateAsync: removeRule, isPending: isRemoving } = useMutation({
    mutationFn: recurringServices.removeRule,
  });

  async function handleStatus(rule: RecurringRule, action: 'end' | 'pause' | 'resume') {
    try {
      await changeStatus({ ruleId: rule.id, action });
      await invalidateFinance();
      toast.success(
        action === 'pause' ? 'Recorrência pausada' : action === 'resume' ? 'Recorrência reativada' : 'Recorrência encerrada',
      );
      setPending(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Não foi possível atualizar a recorrência'));
    }
  }

  async function handleDelete(rule: RecurringRule) {
    try {
      await removeRule(rule.id);
      await invalidateFinance();
      toast.success('Recorrência excluída');
      setPending(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Não foi possível excluir a recorrência'));
    }
  }

  const summary = [
    { label: 'Entradas fixas por mês', value: monthlyIncome, icon: ArrowDownLeft, tone: 'bg-income-soft text-income-strong' },
    { label: 'Saídas fixas por mês', value: monthlyExpense, icon: ArrowUpRight, tone: 'bg-expense-soft text-expense-strong' },
    { label: 'Sobra fixa', value: monthlyIncome - monthlyExpense, icon: Scale, tone: 'bg-primary-soft text-primary-strong dark:text-primary' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {summary.map((item, index) => (
          <Card
            key={item.label}
            className={cn('flex items-center gap-3 p-3.5 sm:p-4', index === 2 && 'col-span-2 sm:col-span-1')}
          >
            <span className={cn('hidden size-10 shrink-0 place-items-center rounded-2xl sm:grid', item.tone)}>
              <item.icon size={18} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted">{item.label}</p>
              {isLoading ? (
                <div className="skeleton mt-1 h-6 w-28" />
              ) : (
                <Money
                  value={item.value}
                  sign={index === 2 ? 'auto' : undefined}
                  className="block truncate text-base font-semibold tracking-tight text-fg sm:text-lg"
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-2 sm:p-3">
        {isLoading && (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-16" />
            ))}
          </div>
        )}

        {!isLoading && rules.length === 0 && (
          <EmptyState
            icon={<Repeat size={26} />}
            title="Nenhum lançamento recorrente"
            description="Salário, aluguel, assinaturas: marque “Repetir” ao criar o lançamento e ele aparece todo mês."
            action={
              <Button onClick={() => openNewTransaction()}>
                <Plus size={18} strokeWidth={2.4} /> Novo lançamento
              </Button>
            }
          />
        )}

        <ul className="space-y-0.5">
          {rules.map((rule) => {
            const next = rule.nextOccurrence;
            const isIncome = rule.type === 'INCOME';

            return (
              <li
                key={rule.id}
                className={cn(
                  'flex items-center rounded-2xl transition-colors hover:bg-subtle',
                  rule.status !== 'ACTIVE' && 'opacity-60',
                )}
              >
                <button
                  type="button"
                  onClick={() => next && openTransactionDetail(next)}
                  disabled={!next}
                  aria-label={`${rule.name}: ${next ? 'ver a próxima ocorrência' : 'sem próximas ocorrências'}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-3 text-left outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-default"
                >
                  <CategoryIcon type={rule.type} icon={rule.category?.icon} color={rule.category?.color} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-medium text-fg">{rule.name}</span>
                      {rule.status !== 'ACTIVE' && <Badge>{STATUS_LABEL[rule.status]}</Badge>}
                      {rule.autoConfirm && <Badge tone="primary">Automático</Badge>}
                    </div>
                    <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted">
                      <span className="inline-flex items-center gap-1 font-medium text-transfer-strong">
                        <Repeat size={11} aria-hidden />
                        {describeRecurrence(rule, rule.startDate)}
                      </span>
                      <span aria-hidden>·</span>
                      <RulePayment rule={rule} />
                      {next && (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            próxima {formatDate(fromApiDate(next.date))} ({formatRelativeDay(fromApiDate(next.date))})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <Money
                      value={rule.value}
                      sign={isIncome ? '+' : '-'}
                      className={cn('font-semibold', isIncome ? 'text-income-strong' : 'text-expense-strong')}
                    />
                    {rule.frequency !== 'MONTHLY' && (
                      <span className="text-[11px] text-muted">
                        ≈ <Money value={rule.monthlyEquivalent} /> /mês
                      </span>
                    )}
                  </div>
                </button>

                <div className="mr-2 shrink-0">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button
                        type="button"
                        aria-label={`Ações de ${rule.name}`}
                        className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-card hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="w-52">
                      {next && (
                        <DropdownMenu.Item onSelect={() => openEditTransaction(next)}>
                          <Pencil size={15} className="text-muted" /> Editar a partir da próxima
                        </DropdownMenu.Item>
                      )}
                      {rule.status === 'ACTIVE' && (
                        <DropdownMenu.Item onSelect={() => handleStatus(rule, 'pause')}>
                          <Pause size={15} className="text-muted" /> Pausar
                        </DropdownMenu.Item>
                      )}
                      {rule.status === 'PAUSED' && (
                        <DropdownMenu.Item onSelect={() => handleStatus(rule, 'resume')}>
                          <Play size={15} className="text-muted" /> Reativar
                        </DropdownMenu.Item>
                      )}
                      {rule.status !== 'ENDED' && (
                        <DropdownMenu.Item onSelect={() => setPending({ rule, kind: 'end' })}>
                          <CircleStop size={15} className="text-muted" /> Encerrar hoje
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item variant="danger" onSelect={() => setPending({ rule, kind: 'delete' })}>
                        <Trash2 size={15} /> Excluir
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <ConfirmDialog
        open={pending?.kind === 'end'}
        onOpenChange={(open) => !open && setPending(null)}
        title={`Encerrar “${pending?.rule.name ?? ''}”?`}
        description="As ocorrências depois de hoje que ainda não foram confirmadas serão removidas. O histórico continua."
        confirmLabel="Encerrar"
        variant="neutral"
        isLoading={isChanging}
        onConfirm={() => pending && handleStatus(pending.rule, 'end')}
      />
      <ConfirmDialog
        open={pending?.kind === 'delete'}
        onOpenChange={(open) => !open && setPending(null)}
        title={`Excluir “${pending?.rule.name ?? ''}”?`}
        description="A recorrência e as ocorrências previstas somem. As já confirmadas ficam no histórico."
        confirmLabel="Excluir"
        isLoading={isRemoving}
        onConfirm={() => pending && handleDelete(pending.rule)}
      />
    </div>
  );
}
