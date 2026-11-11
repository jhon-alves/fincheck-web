import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDashboard } from '../../components/Dashboard';
import { dayKey, fromApiDate } from '../../helpers';
import { useDebouncedValue, useTransactions } from '../../hooks';
import type {
  PaymentMethod,
  Transaction,
  TransactionType,
} from '../../types/transactions-types';

export type StatementFilters = {
  type?: TransactionType;
  paid?: boolean;
  paymentMethod?: PaymentMethod;
  bankAccountId?: string;
  cardId?: string;
  categoryId?: string;
};

export type DayGroup = {
  key: string;
  date: Date;
  transactions: Transaction[];
  /** Entradas − saídas do dia (transferências não contam). */
  total: number;
};

export function useStatementController() {
  const { selectedMonth, openTransactionDetail, openNewTransaction } = useDashboard();
  const [search, setSearch] = useState('');
  // Vindo de Categorias (/extrato?categoria=<id>), já abre filtrado.
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<StatementFilters>(() => {
    const categoryId = searchParams.get('categoria');
    return categoryId ? { categoryId } : {};
  });
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { transactions, isInitialLoading, isFetching } = useTransactions({
    month: selectedMonth.month,
    year: selectedMonth.year,
    ...filters,
    search: debouncedSearch || undefined,
  });

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') income += transaction.value;
      if (transaction.type === 'EXPENSE') expense += transaction.value;

      // Filtrando por conta, transferências entram/saem dela de verdade.
      if (transaction.type === 'TRANSFER' && filters.bankAccountId) {
        if (transaction.toBankAccountId === filters.bankAccountId) income += transaction.value;
        if (transaction.bankAccountId === filters.bankAccountId) expense += transaction.value;
      }
    }

    return { income, expense, balance: income - expense };
  }, [transactions, filters.bankAccountId]);

  const groups = useMemo(() => {
    const byDay = new Map<string, DayGroup>();

    for (const transaction of transactions) {
      const key = dayKey(transaction.date);
      const group = byDay.get(key) ?? {
        key,
        date: fromApiDate(transaction.date),
        transactions: [],
        total: 0,
      };

      group.transactions.push(transaction);
      if (transaction.type === 'INCOME') group.total += transaction.value;
      if (transaction.type === 'EXPENSE') group.total -= transaction.value;
      byDay.set(key, group);
    }

    // A API já devolve da mais recente para a mais antiga.
    return [...byDay.values()];
  }, [transactions]);

  const activeFilterCount = Object.values(filters).filter((value) => value !== undefined).length;

  function updateFilter<K extends keyof StatementFilters>(key: K, value: StatementFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({});
    setSearch('');
  }

  return {
    selectedMonth,
    search,
    setSearch,
    isSearching: search.trim() !== debouncedSearch,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    hasQuery: activeFilterCount > 0 || debouncedSearch !== '',
    transactions,
    groups,
    summary,
    isInitialLoading,
    isFetching,
    openTransactionDetail,
    openNewTransaction,
  };
}
