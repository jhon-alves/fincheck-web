import { SlidersHorizontal, X } from 'lucide-react';
import { Button, Popover, Select, SegmentedControl } from '../../../components/Shared';
import { paymentMethodLabels } from '../../../components/Transactions';
import { useBankAccounts, useCards, useCategories } from '../../../hooks';
import type { PaymentMethod, TransactionType } from '../../../types/transactions-types';
import type { StatementFilters as Filters } from '../useStatementController';

const ALL = '__all__';

interface StatementFiltersProps {
  filters: Filters;
  activeCount: number;
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClear: () => void;
}

type TypeOption = 'ALL' | TransactionType;
type PaidOption = 'ALL' | 'PAID' | 'PENDING';

/** Botão "Filtros" com o popover de filtros. */
export function StatementFiltersButton({ filters, activeCount, onChange, onClear }: StatementFiltersProps) {
  const { accounts } = useBankAccounts();
  const { cards } = useCards();
  const { categories } = useCategories();

  const withAll = (label: string, options: { value: string; label: string }[]) => [
    { value: ALL, label },
    ...options,
  ];

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="secondary" className="relative">
          <SlidersHorizontal size={16} />
          Filtros
          {activeCount > 0 && (
            <span className="money grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
              {activeCount}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" className="w-[min(92vw,380px)] space-y-4 p-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted uppercase">Tipo</span>
          <SegmentedControl<TypeOption>
            aria-label="Tipo"
            size="sm"
            value={filters.type ?? 'ALL'}
            onChange={(value) => onChange('type', value === 'ALL' ? undefined : value)}
            options={[
              { value: 'ALL', label: 'Todos' },
              { value: 'INCOME', label: 'Entradas' },
              { value: 'EXPENSE', label: 'Saídas' },
              { value: 'TRANSFER', label: 'Transf.' },
            ]}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted uppercase">Status</span>
          <SegmentedControl<PaidOption>
            aria-label="Status"
            size="sm"
            value={filters.paid === undefined ? 'ALL' : filters.paid ? 'PAID' : 'PENDING'}
            onChange={(value) =>
              onChange('paid', value === 'ALL' ? undefined : value === 'PAID')
            }
            options={[
              { value: 'ALL', label: 'Todos' },
              { value: 'PAID', label: 'Pagos' },
              { value: 'PENDING', label: 'Pendentes' },
            ]}
          />
        </div>

        <Select
          placeholder="Forma de pagamento"
          value={filters.paymentMethod ?? ALL}
          onChange={(value) =>
            onChange('paymentMethod', value === ALL ? undefined : (value as PaymentMethod))
          }
          options={withAll(
            'Todas',
            (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => ({
              value: method,
              label: paymentMethodLabels[method],
            })),
          )}
        />
        <Select
          placeholder="Conta"
          value={filters.bankAccountId ?? ALL}
          onChange={(value) => onChange('bankAccountId', value === ALL ? undefined : value)}
          options={withAll(
            'Todas',
            accounts.map((account) => ({ value: account.id, label: account.name })),
          )}
        />
        <Select
          placeholder="Cartão"
          value={filters.cardId ?? ALL}
          onChange={(value) => onChange('cardId', value === ALL ? undefined : value)}
          options={withAll(
            'Todos',
            cards.map((card) => ({ value: card.id, label: `${card.name} •••• ${card.lastDigits}` })),
          )}
        />
        <Select
          placeholder="Categoria"
          value={filters.categoryId ?? ALL}
          onChange={(value) => onChange('categoryId', value === ALL ? undefined : value)}
          options={withAll(
            'Todas',
            categories.map((category) => ({
              value: category.id,
              label: `${category.name} · ${category.type === 'INCOME' ? 'entrada' : 'saída'}`,
            })),
          )}
        />

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-expense-strong hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}

/** Chips dos filtros ativos, cada um com "×" para remover. */
export function ActiveFilterChips({ filters, onChange, onClear }: Omit<StatementFiltersProps, 'activeCount'>) {
  const { accounts } = useBankAccounts();
  const { cards } = useCards();
  const { categories } = useCategories();

  const chips: Array<{ key: keyof Filters; label: string }> = [];

  if (filters.type) {
    chips.push({
      key: 'type',
      label: { INCOME: 'Entradas', EXPENSE: 'Saídas', TRANSFER: 'Transferências' }[filters.type],
    });
  }
  if (filters.paid !== undefined) {
    chips.push({ key: 'paid', label: filters.paid ? 'Pagos' : 'Pendentes' });
  }
  if (filters.paymentMethod) {
    chips.push({ key: 'paymentMethod', label: paymentMethodLabels[filters.paymentMethod] });
  }
  if (filters.bankAccountId) {
    const account = accounts.find((item) => item.id === filters.bankAccountId);
    chips.push({ key: 'bankAccountId', label: `Conta: ${account?.name ?? '…'}` });
  }
  if (filters.cardId) {
    const card = cards.find((item) => item.id === filters.cardId);
    chips.push({ key: 'cardId', label: `Cartão: ${card?.name ?? '…'}` });
  }
  if (filters.categoryId) {
    const category = categories.find((item) => item.id === filters.categoryId);
    chips.push({ key: 'categoryId', label: `Categoria: ${category?.name ?? '…'}` });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-card pr-1 pl-3 text-xs font-medium text-fg"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onChange(chip.key, undefined)}
            aria-label={`Remover filtro ${chip.label}`}
            className="grid size-6 place-items-center rounded-full text-muted hover:bg-subtle hover:text-fg"
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="h-8 rounded-full px-2 text-xs font-semibold text-muted hover:text-fg"
      >
        Limpar
      </button>
    </div>
  );
}
