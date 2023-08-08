export interface Transaction {
  id: string;
  name: string;
  value: number;
  date: string;
  type: 'EXPENSE' | 'INCOME';
  category?: {
    id: string;
    name: string;
    icon: string;
  }
}
