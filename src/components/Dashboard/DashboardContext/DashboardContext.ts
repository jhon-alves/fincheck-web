import { createContext } from 'react';
import { BankAccount } from '../../../types/bank-types';

export interface DashboardContextValue {
  areValuesVisible: boolean;
  toggleValueVisibility: () => void;
  openNewAccountModal: () => void;
  closeNewAccountModal: () => void;
  isNewAccountModalOpen: boolean;
  openNewTransactionModal: (type: 'INCOME' | 'EXPENSE') => void;
  closeNewTransactionModal: () => void;
  isNewTransactionModalOpen: boolean;
  newTransactionType: 'INCOME' | 'EXPENSE' | null;
  openNewTransferModal: () => void;
  closeNewTransferModal: () => void;
  isNewTransferModalOpen: boolean;
  isEditAccountModalOpen: boolean;
  openEditAccountModal: (bankAccount: BankAccount) => void;
  closeEditAccountModal: () => void;
  accountBeingEdited: BankAccount | null;
}

export const DashboardContext = createContext({} as DashboardContextValue);
