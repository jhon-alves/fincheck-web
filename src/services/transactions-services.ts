import {
  CreateTransactionParams,
  TransactionsFilters,
  TransactionsResponse,
  UpdateTransactionParams
} from "../types/transactions-types";
import { httpClient } from "./httpClient";

export const transactionsServices = {
  getTransactions,
  createTransaction,
  updateTransaction,
  removeTransaction
}

async function getTransactions(filters: TransactionsFilters) {
  const { data } = await httpClient.get<TransactionsResponse>('transactions', {
    params: filters,
  });

  return data;
}

async function createTransaction(params: CreateTransactionParams) {
  const { data } = await httpClient.post('transactions', params);
  return data;
}

async function updateTransaction({ id, ...params }: UpdateTransactionParams) {
  const { data } = await httpClient.put(`transactions/${id}`, params);
  return data;
}

async function removeTransaction(transactionId: string) {
  const { data } = await httpClient.delete(`transactions/${transactionId}`);
  return data;
}
