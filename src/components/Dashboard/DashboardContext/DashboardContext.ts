import { createContext } from 'react';
import { BankAccount } from '../../../types/bank-types';
import {
  InstallmentScope,
  Transaction,
  TransactionType,
} from '../../../types/transactions-types';

export type SelectedMonth = {
  /** 0 a 11 */
  month: number;
  year: number;
};

export type TransactionFormState =
  | { open: false }
  | {
      open: true;
      mode: 'create';
      type: TransactionType;
      /** Data já preenchida (ex.: "+ Adicionar neste dia" no calendário). */
      date?: Date;
    }
  | {
      open: true;
      mode: 'edit';
      transaction: Transaction;
      scope: InstallmentScope;
    };

export interface DashboardContextValue {
  // Modo privacidade
  areValuesVisible: boolean;
  toggleValueVisibility: () => void;

  // Mês selecionado no header, compartilhado entre as páginas
  selectedMonth: SelectedMonth;
  setSelectedMonth: (month: SelectedMonth) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;

  // Contas
  openNewAccountModal: () => void;
  closeNewAccountModal: () => void;
  isNewAccountModalOpen: boolean;
  isEditAccountModalOpen: boolean;
  openEditAccountModal: (bankAccount: BankAccount) => void;
  closeEditAccountModal: () => void;
  accountBeingEdited: BankAccount | null;

  // Lançamentos (drawers globais)
  transactionForm: TransactionFormState;
  openNewTransaction: (options?: { type?: TransactionType; date?: Date }) => void;
  openEditTransaction: (transaction: Transaction, scope?: InstallmentScope) => void;
  closeTransactionForm: () => void;
  transactionInDetail: Transaction | null;
  openTransactionDetail: (transaction: Transaction) => void;
  closeTransactionDetail: () => void;
}

export const DashboardContext = createContext({} as DashboardContextValue);
