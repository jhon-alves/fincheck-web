import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../../../types/transactions-types';
import { useTransactions } from '../../../hooks';
import { useDashboard } from '../DashboardContext/useDashboard';
import { transfersServices } from '../../../services/transfers-services';
import { TransactionsFilters } from '../../../types/transactions-types';

export function useTransactionController() {
  const { areValuesVisible } = useDashboard();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionsFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionBeingEdited, setTransactionBeingEdited] =
    useState<Transaction | null>(null);
  const [transferBeingDeleted, setTransferBeingDeleted] =
    useState<Transaction | null>(null);

  const queryClient = useQueryClient();
  const { isPending: isDeletingTransfer, mutateAsync: removeTransfer } =
    useMutation({ mutationFn: transfersServices.removeTransfer });

  const { transactions, isLoading, isInitialLoading, refetch } =
    useTransactions(filters);

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  function handleChangeFilters<TFilter extends keyof TransactionsFilters>(
    filter: TFilter
  ) {
    return (value: TransactionsFilters[TFilter]) => {
      if (value === filters[filter]) return;

      setFilters((prevState) => ({
        ...prevState,
        [filter]: value,
      }));
    };
  }

  function handleApplyFilters({
    bankAccountId,
    year,
  }: {
    bankAccountId: string | undefined;
    year: number;
  }) {
    handleChangeFilters('bankAccountId')(bankAccountId);
    handleChangeFilters('year')(year);
    setIsFiltersModalOpen(false);
  }

  function handleOpenFiltersModal() {
    setIsFiltersModalOpen(true);
  }

  function handleCloseFiltersModal() {
    setIsFiltersModalOpen(false);
  }

  function handleOpenEditModal(transaction: Transaction) {
    setIsEditModalOpen(true);
    setTransactionBeingEdited(transaction);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setTransactionBeingEdited(null);
  }

  function handleOpenDeleteTransferModal(transaction: Transaction) {
    setTransferBeingDeleted(transaction);
  }

  function handleCloseDeleteTransferModal() {
    setTransferBeingDeleted(null);
  }

  async function handleDeleteTransfer() {
    if (!transferBeingDeleted) return;

    try {
      await removeTransfer(transferBeingDeleted.id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success('Transferência removida com sucesso!');
      setTransferBeingDeleted(null);
    } catch {
      toast.error('Erro ao remover a transferência');
    }
  }

  return {
    areValuesVisible,
    isInitialLoading,
    transactions,
    isLoading,
    isFiltersModalOpen,
    handleCloseFiltersModal,
    handleOpenFiltersModal,
    handleChangeFilters,
    filters,
    handleApplyFilters,
    transactionBeingEdited,
    isEditModalOpen,
    handleOpenEditModal,
    handleCloseEditModal,
    transferBeingDeleted,
    isDeletingTransfer,
    handleOpenDeleteTransferModal,
    handleCloseDeleteTransferModal,
    handleDeleteTransfer,
  };
}
