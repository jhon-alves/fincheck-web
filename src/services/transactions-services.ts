import {
  CalendarDay,
  CreateTransactionParams,
  InstallmentScope,
  Transaction,
  TransactionsFilters,
  TransactionsResponse,
  UpdateTransactionParams,
} from '../types/transactions-types';
import { httpClient } from './httpClient';

export const transactionsServices = {
  getTransactions,
  getCalendar,
  getInstallmentGroup,
  createTransaction,
  updateTransaction,
  removeTransaction,
  confirmTransaction,
};

async function getTransactions(filters: TransactionsFilters) {
  const { data } = await httpClient.get<TransactionsResponse>('transactions', {
    params: filters,
  });

  return data;
}

/** `month` vai de 0 a 11. */
async function getCalendar(month: number, year: number) {
  const { data } = await httpClient.get<CalendarDay[]>('transactions/calendar', {
    params: { month, year },
  });

  return data;
}

async function getInstallmentGroup(installmentGroupId: string) {
  const { data } = await httpClient.get<Transaction[]>(
    `transactions/installments/${installmentGroupId}`,
  );

  return data;
}

async function createTransaction(params: CreateTransactionParams) {
  const { data } = await httpClient.post<Transaction | Transaction[]>(
    'transactions',
    params,
  );
  return data;
}

async function updateTransaction({
  id,
  scope = 'one',
  ...params
}: UpdateTransactionParams) {
  const { data } = await httpClient.put<Transaction>(
    `transactions/${id}`,
    params,
    { params: { scope } },
  );
  return data;
}

async function removeTransaction({
  id,
  scope = 'one',
}: {
  id: string;
  scope?: InstallmentScope;
}) {
  await httpClient.delete(`transactions/${id}`, { params: { scope } });
}

/** Confirma (ou desfaz) o pagamento/recebimento sem destacar a recorrência. */
async function confirmTransaction({ id, paid = true }: { id: string; paid?: boolean }) {
  const { data } = await httpClient.patch<Transaction>(`transactions/${id}/confirm`, { paid });
  return data;
}
