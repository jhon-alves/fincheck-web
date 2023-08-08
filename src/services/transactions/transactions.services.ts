import { api } from '../../helpers';
import { CreateTransactionParams, TransactionsFilters, TransactionsResponse, UpdateTransactionsParams } from './types';

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

async function findTransactions(filters: TransactionsFilters) {
	const { data } = await api.get<TransactionsResponse>('/transactions', {
		params: filters
	});
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
