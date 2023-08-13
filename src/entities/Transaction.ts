export interface Transaction {
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
