import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import {
  Badge,
  Button,
  DropdownMenu,
  Money,
  SegmentedControl,
  Tooltip,
} from '../../components/Shared';
import { CategoryIcon } from '../../components/Icons';
import { CategoryFormDrawer, DeleteCategoryDialog } from '../../components/Categories';
import { useDashboard } from '../../components/Dashboard';
import { cn, formatMonthYear } from '../../helpers';
import { useCategories, useTransactions } from '../../hooks';
import type { Category, CategoryType } from '../../types/categories-types';

type CategoryRow = { category: Category; total: number; count: number };

const LOCKED_HINT = 'Categoria padrão — não pode ser editada ou excluída';

function CategoryCard({
  row,
  share,
  onOpen,
  onEdit,
  onDelete,
}: {
  row: CategoryRow;
  share: number;
  onOpen: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  const { category, total, count } = row;
  const isIncome = category.type === 'INCOME';

  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-float">
      {/* Área clicável do card inteiro (abre o extrato filtrado). O menu fica
          por cima, então não há botão dentro de botão. */}
      <button
        type="button"
        onClick={() => onOpen(category)}
        aria-label={`Ver lançamentos de ${category.name} no extrato`}
        className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring"
      />

      <div className="pointer-events-none relative flex items-start justify-between gap-2">
        <CategoryIcon type={category.type} icon={category.icon} color={category.color} size="lg" />

        {category.isDefault ? (
          <Tooltip label={LOCKED_HINT}>
            <span
              tabIndex={0}
              aria-label={LOCKED_HINT}
              className="pointer-events-auto relative z-10 inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              <Badge>
                <Lock size={10} aria-hidden /> Padrão
              </Badge>
            </span>
          </Tooltip>
        ) : (
          <div className="pointer-events-auto relative z-10">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button
                  type="button"
                  aria-label={`Ações da categoria ${category.name}`}
                  className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <MoreHorizontal size={18} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-44">
                <DropdownMenu.Item onSelect={() => onEdit(category)}>
                  <Pencil size={15} className="text-muted" /> Editar
                </DropdownMenu.Item>
                <DropdownMenu.Item variant="danger" onSelect={() => onDelete(category)}>
                  <Trash2 size={15} /> Excluir
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        )}
      </div>

      <div className="pointer-events-none relative min-w-0">
        <p className="truncate font-semibold text-fg">{category.name}</p>
        <p className="text-xs text-muted">
          {count === 0 ? 'Nenhum lançamento no mês' : `${count} lançamento${count > 1 ? 's' : ''} no mês`}
        </p>
      </div>

      <div className="pointer-events-none relative mt-auto space-y-2">
        <Money
          value={total}
          className={cn('block text-lg font-semibold tracking-tight', count === 0 ? 'text-muted' : 'text-fg')}
        />
        <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
          <div
            className={cn('h-full rounded-full transition-[width] duration-500', isIncome ? 'bg-income' : 'bg-expense')}
            style={{ width: `${share * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** Categorias do mês: padrão (fixas) e personalizadas (CRUD). */
export function CategoriesPage() {
  const navigate = useNavigate();
  const { selectedMonth } = useDashboard();
  const [type, setType] = useState<CategoryType>('EXPENSE');
  const [form, setForm] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [deleting, setDeleting] = useState<Category | null>(null);
  const { categories, isFetching: isFetchingCategories } = useCategories();
  const { transactions, isInitialLoading } = useTransactions({
    month: selectedMonth.month,
    year: selectedMonth.year,
  });

  const { defaults, customs, grandTotal } = useMemo(() => {
    const totals = new Map<string, { total: number; count: number }>();

    for (const transaction of transactions) {
      if (transaction.type !== type || !transaction.categoryId) continue;
      const current = totals.get(transaction.categoryId) ?? { total: 0, count: 0 };
      totals.set(transaction.categoryId, {
        total: current.total + transaction.value,
        count: current.count + 1,
      });
    }

    const rows: CategoryRow[] = categories
      .filter((category) => category.type === type)
      .map((category) => ({ category, ...(totals.get(category.id) ?? { total: 0, count: 0 }) }))
      .sort((a, b) => b.total - a.total || a.category.name.localeCompare(b.category.name, 'pt-BR'));

    return {
      defaults: rows.filter((row) => row.category.isDefault),
      customs: rows.filter((row) => !row.category.isDefault),
      grandTotal: rows.reduce((total, row) => total + row.total, 0),
    };
  }, [categories, transactions, type]);

  const monthLabel = formatMonthYear(new Date(selectedMonth.year, selectedMonth.month, 1));
  const isLoading = isInitialLoading || (isFetchingCategories && categories.length === 0);
  const openNew = () => setForm({ open: true, category: null });
  const openEdit = (category: Category) => setForm({ open: true, category });
  const openInStatement = (category: Category) => navigate(`/extrato?categoria=${category.id}`);

  const renderGrid = (rows: CategoryRow[], offset = 0) =>
    rows.map((row, index) => (
      <motion.li
        key={row.category.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (offset + index) * 0.025, duration: 0.25 }}
      >
        <CategoryCard
          row={row}
          share={grandTotal > 0 ? row.total / grandTotal : 0}
          onOpen={openInStatement}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      </motion.li>
    ));

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl<CategoryType>
          aria-label="Tipo de categoria"
          value={type}
          onChange={setType}
          className="sm:w-72"
          options={[
            { value: 'EXPENSE', label: 'Saídas' },
            { value: 'INCOME', label: 'Entradas' },
          ]}
        />
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {type === 'EXPENSE' ? 'Gasto' : 'Recebido'} em {monthLabel}:{' '}
            <Money value={grandTotal} className="font-semibold text-fg" />
          </p>
          <Button onClick={openNew}>
            <Plus size={18} strokeWidth={2.4} /> Nova categoria
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <section aria-labelledby="default-categories" className="space-y-3">
            <h2 id="default-categories" className="flex items-center gap-1.5 text-sm font-semibold text-fg-soft">
              <Lock size={13} className="text-muted" /> Padrão
              <span className="font-normal text-muted">· {defaults.length}</span>
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{renderGrid(defaults)}</ul>
          </section>

          <section aria-labelledby="custom-categories" className="space-y-3">
            <h2 id="custom-categories" className="text-sm font-semibold text-fg-soft">
              Personalizadas <span className="font-normal text-muted">· {customs.length}</span>
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {renderGrid(customs, defaults.length)}
              <li>
                <button
                  type="button"
                  onClick={openNew}
                  className="flex h-full min-h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted transition-colors hover:border-primary-strong/40 hover:bg-card hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-subtle">
                    <Plus size={20} />
                  </span>
                  <span className="text-sm font-medium">Nova categoria</span>
                </button>
              </li>
            </ul>
          </section>
        </>
      )}

      <CategoryFormDrawer
        open={form.open}
        category={form.category}
        defaultType={type}
        onClose={() => setForm((prev) => ({ ...prev, open: false }))}
      />
      <DeleteCategoryDialog
        category={deleting}
        categories={categories}
        onClose={() => setDeleting(null)}
      />
    </PageContainer>
  );
}
