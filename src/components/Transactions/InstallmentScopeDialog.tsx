import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn, formatDate, fromApiDate } from '../../helpers';
import { Button } from '../Shared/Button';
import type { InstallmentScope, Transaction } from '../../types/transactions-types';

interface InstallmentScopeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  action: 'edit' | 'delete';
  isLoading?: boolean;
  onConfirm: (scope: InstallmentScope) => void;
}

/**
 * "Só esta", "esta e as próximas" ou "todas" — como no Google Agenda. Serve
 * para parcelas e para ocorrências de lançamentos recorrentes.
 */
export function InstallmentScopeDialog({
  open,
  onOpenChange,
  transaction,
  action,
  isLoading,
  onConfirm,
}: InstallmentScopeDialogProps) {
  const [scope, setScope] = useState<InstallmentScope>('one');
  const current = transaction.installmentNumber ?? 1;
  const total = transaction.installmentsTotal ?? 1;
  const isDelete = action === 'delete';
  const isRecurring = !!transaction.recurringRuleId;
  const occurrence = formatDate(fromApiDate(transaction.date));

  const options: Array<{ value: InstallmentScope; label: string; hint: string }> = isRecurring
    ? [
        {
          value: 'one',
          label: 'Só esta ocorrência',
          hint: isDelete ? `Só a de ${occurrence}; as outras continuam` : `Só a de ${occurrence}`,
        },
        {
          value: 'following',
          label: 'Esta e as próximas',
          hint: isDelete
            ? 'A recorrência termina antes desta'
            : 'A partir desta; as anteriores não mudam',
        },
        {
          value: 'all',
          label: isDelete ? 'Encerrar a recorrência' : 'Todas as não confirmadas',
          hint: isDelete
            ? 'Remove as previstas; as confirmadas ficam no histórico'
            : 'As já confirmadas não mudam',
        },
      ]
    : [
        { value: 'one', label: 'Só esta parcela', hint: `Parcela ${current} de ${total}` },
        {
          value: 'following',
          label: 'Esta e as próximas',
          hint: current === total ? `Parcela ${current}` : `Parcelas ${current} a ${total}`,
        },
        { value: 'all', label: 'Todas as parcelas', hint: `Parcelas 1 a ${total}` },
      ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-overlay backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[81] w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-float outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in">
          <Dialog.Title className="text-lg font-semibold tracking-tight text-fg">
            {isDelete
              ? isRecurring
                ? 'Excluir lançamento recorrente'
                : 'Excluir parcela'
              : 'Salvar alterações'}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">
            “{transaction.name}”{' '}
            {isRecurring ? 'é um lançamento recorrente' : 'faz parte de um parcelamento'}. O que
            você quer {isDelete ? 'excluir' : 'alterar'}?
          </Dialog.Description>

          <div role="radiogroup" aria-label="Escopo" className="mt-5 space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
                  scope === option.value
                    ? 'border-fg/30 bg-subtle'
                    : 'border-border hover:bg-subtle',
                )}
              >
                <input
                  type="radio"
                  name="installment-scope"
                  value={option.value}
                  checked={scope === option.value}
                  onChange={() => setScope(option.value)}
                  className="size-4 accent-[var(--primary-strong)]"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-fg">{option.label}</span>
                  <span className="block text-xs text-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant={isDelete ? 'danger' : 'primary'}
              isLoading={isLoading}
              onClick={() => onConfirm(scope)}
            >
              {isDelete ? 'Excluir' : 'Salvar'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
