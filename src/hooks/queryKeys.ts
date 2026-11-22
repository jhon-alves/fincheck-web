import type { InvoiceRef } from '../types/cards-types';
import type { TransactionsFilters } from '../types/transactions-types';

/**
 * Query keys do React Query num lugar só. A primeira posição é o "domínio":
 * invalidar `['transactions']` alcança todas as listas filtradas.
 */
export const queryKeys = {
  me: ['users', 'me'] as const,
  bankAccounts: ['bankAccounts'] as const,
  categories: ['categories'] as const,
  cards: ['cards'] as const,
  recurringRules: ['recurringRules'] as const,
  transactions: (filters?: TransactionsFilters) =>
    filters ? (['transactions', filters] as const) : (['transactions'] as const),
  installments: (groupId: string) =>
    ['transactions', 'installments', groupId] as const,
  calendar: (month?: number, year?: number) =>
    month === undefined ? (['calendar'] as const) : (['calendar', month, year] as const),
  invoice: (cardId?: string, ref?: InvoiceRef) =>
    cardId && ref ? (['invoice', cardId, ref] as const) : (['invoice'] as const),
  dashboard: (month?: number, year?: number) =>
    month === undefined
      ? (['dashboard'] as const)
      : (['dashboard', month, year] as const),
};
