export type Transaction = {
  id: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  bankAccountId: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
}

export type TransactionsFilters = {
  month: number;
  year: number;
  bankAccountId?: string;
  type?: Transaction['type'];
};

export type TransactionsResponse = Array<Transaction>;

export type CreateTransactionParams = {
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export type UpdateTransactionParams = {
  id: string;
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}
