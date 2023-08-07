import { api } from '../../helpers';
import { CreateTransactionParams, TransactionsResponse, UpdateTransactionsParams } from './types';

export const transactionsServices = {
	createTransaction,
	findTransactions,
	updateTransaction,
	deleteTransactions
};

async function createTransaction(params: CreateTransactionParams) {
	const { data } = await api.post('/transactions', params);
	return data;
}

async function findTransactions() {
	const { data } = await api.get<TransactionsResponse>('/transactions');
	return data;
}

async function updateTransaction({ id, ...params }: UpdateTransactionsParams) {
	const { data } = await api.put(`/transactions/${id}`, params);
	return data;
}

async function deleteTransactions(id: string) {
	const { data } = await api.delete(`/transactions/${id}`);
	return data;
}
