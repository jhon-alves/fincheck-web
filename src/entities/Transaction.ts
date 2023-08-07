import { Category } from './Category';

export interface Transaction {
  id: string;
  bankAccountId: string;
  categoryId: Category;
  name: string;
  value: number;
  date: string;
  type: 'EXPENSE' | 'INCOME';
}
