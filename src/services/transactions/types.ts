import { Transaction } from '../../entities/Transaction';

export interface CreateTransactionParams {
  bankAccountId: string;
	categoryId: string;
	name: string;
	value: number;
	date: string;
	type: 'EXPENSE' | 'INCOME'
}

export type TransactionsResponse = Array<Transaction>;

export interface UpdateTransactionsParams {
  id: string;
  bankAccountId: string;
	categoryId: string;
	name: string;
	value: number;
	date: string;
	type: 'EXPENSE' | 'INCOME'
}
