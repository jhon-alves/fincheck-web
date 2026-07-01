export type Transaction = {
  id: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  paid: boolean;
  bankAccountId: string;
  toBankAccountId?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  bankAccount?: {
    id: string;
    name: string;
  };
  toBankAccount?: {
    id: string;
    name: string;
  };
}

export type TransactionsFilters = {
  month: number;
  year: number;
  bankAccountId?: string;
  type?: 'INCOME' | 'EXPENSE';
};

export type TransactionsResponse = Array<Transaction>;

export type CreateTransactionParams = {
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  paid: boolean;
}

export type UpdateTransactionParams = {
  id: string;
  bankAccountId: string;
  categoryId: string;
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  paid: boolean;
}
