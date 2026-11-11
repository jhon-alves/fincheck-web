import { ReactNode, useCallback, useMemo, useState } from 'react';
import { BankAccount } from '../../../types/bank-types';
import {
  InstallmentScope,
  Transaction,
  TransactionType,
} from '../../../types/transactions-types';
import { readStorage, writeStorage } from '../../../helpers/storage';
import {
  DashboardContext,
  SelectedMonth,
  TransactionFormState,
} from './DashboardContext';

const VALUES_VISIBLE_KEY = 'fincheck:values-visible';

function currentMonth(): SelectedMonth {
  const today = new Date();
  return { month: today.getMonth(), year: today.getFullYear() };
}

function shiftMonth({ month, year }: SelectedMonth, amount: number) {
  const date = new Date(year, month + amount, 1);
  return { month: date.getMonth(), year: date.getFullYear() };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(
    () => readStorage(VALUES_VISIBLE_KEY) !== 'false',
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [accountBeingEdited, setAccountBeingEdited] =
    useState<BankAccount | null>(null);

  const [transactionForm, setTransactionForm] = useState<TransactionFormState>({
    open: false,
  });
  const [transactionInDetail, setTransactionInDetail] =
    useState<Transaction | null>(null);

  const toggleValueVisibility = useCallback(() => {
    setAreValuesVisible((prevState) => {
      writeStorage(VALUES_VISIBLE_KEY, String(!prevState));
      return !prevState;
    });
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth((prev) => shiftMonth(prev, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth((prev) => shiftMonth(prev, 1));
  }, []);

  const goToCurrentMonth = useCallback(() => {
    setSelectedMonth(currentMonth());
  }, []);

  const openNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(true);
  }, []);

  const closeNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(false);
  }, []);

  const openEditAccountModal = useCallback((bankAccount: BankAccount) => {
    setAccountBeingEdited(bankAccount);
    setIsEditAccountModalOpen(true);
  }, []);

  const closeEditAccountModal = useCallback(() => {
    setAccountBeingEdited(null);
    setIsEditAccountModalOpen(false);
  }, []);

  const openNewTransaction = useCallback(
    (options?: { type?: TransactionType; date?: Date }) => {
      setTransactionForm({
        open: true,
        mode: 'create',
        type: options?.type ?? 'EXPENSE',
        date: options?.date,
      });
    },
    [],
  );

  const openEditTransaction = useCallback(
    (transaction: Transaction, scope: InstallmentScope = 'one') => {
      setTransactionInDetail(null);
      setTransactionForm({ open: true, mode: 'edit', transaction, scope });
    },
    [],
  );

  const closeTransactionForm = useCallback(() => {
    setTransactionForm({ open: false });
  }, []);

  const openTransactionDetail = useCallback((transaction: Transaction) => {
    setTransactionInDetail(transaction);
  }, []);

  const closeTransactionDetail = useCallback(() => {
    setTransactionInDetail(null);
  }, []);

  const value = useMemo(
    () => ({
      areValuesVisible,
      toggleValueVisibility,
      selectedMonth,
      setSelectedMonth,
      goToPreviousMonth,
      goToNextMonth,
      goToCurrentMonth,
      isNewAccountModalOpen,
      openNewAccountModal,
      closeNewAccountModal,
      openEditAccountModal,
      closeEditAccountModal,
      isEditAccountModalOpen,
      accountBeingEdited,
      transactionForm,
      openNewTransaction,
      openEditTransaction,
      closeTransactionForm,
      transactionInDetail,
      openTransactionDetail,
      closeTransactionDetail,
    }),
    [
      areValuesVisible,
      toggleValueVisibility,
      selectedMonth,
      goToPreviousMonth,
      goToNextMonth,
      goToCurrentMonth,
      isNewAccountModalOpen,
      openNewAccountModal,
      closeNewAccountModal,
      openEditAccountModal,
      closeEditAccountModal,
      isEditAccountModalOpen,
      accountBeingEdited,
      transactionForm,
      openNewTransaction,
      openEditTransaction,
      closeTransactionForm,
      transactionInDetail,
      openTransactionDetail,
      closeTransactionDetail,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
