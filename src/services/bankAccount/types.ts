import { BankAccount } from '../../entities/BankAccount';

export type BankAccountParams = {
  name: string;
  color: string;
  initialBalance: number;
  type: 'CHECKING' | 'INVESTMENT' | 'CASH';
}

export type UpdateAccountParams = {
  id: string;
  name: string;
  color: string;
  initialBalance: number;
  type: 'CHECKING' | 'INVESTMENT' | 'CASH';
}

export type AccountsResponse = Array<BankAccount>
