import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../../../../types/transactions-types';
import { transactionsServices } from '../../../../services/transactions-services';
import { currencyStringToNumber, dateToApi } from '../../../../helpers';
import { useCategories, useBankAccounts } from '../../../../hooks';

const schema = z.object({
  value: z.union([z.string().nonempty('Informe o valor'), z.number()]),
  name: z.string().nonempty('Informe o nome'),
  categoryId: z.string().nonempty('Informe a categoria'),
  bankAccountId: z.string().nonempty('Informe a conta'),
  date: z.date(),
  paid: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function useEditTransactionController(
  transaction: Transaction | null,
  onClose: () => void
) {
  const {
    handleSubmit: hookFormHandleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.category?.id,
      date: transaction ? new Date(transaction.date) : new Date(),
      name: transaction?.name,
      value: transaction?.value,
      paid: transaction?.paid ?? true,
    },
  });

  const queryClient = useQueryClient();

  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();

  const { isPending: isLoading, mutateAsync: updateTransaction } = useMutation({
    mutationFn: transactionsServices.updateTransaction,
  });
  const { isPending: isLoadingDelete, mutateAsync: removeTransaction } =
    useMutation({ mutationFn: transactionsServices.removeTransaction });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await updateTransaction({
        ...data,
        id: transaction!.id,
        value: currencyStringToNumber(data!.value),
        type: transaction!.type as 'INCOME' | 'EXPENSE',
        date: dateToApi(data!.date),
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success(
        transaction?.type === 'EXPENSE'
          ? 'Despesa editada com sucesso!'
          : 'Receita editada com sucesso!'
      );
      onClose();
    } catch {
      toast.error(
        transaction?.type === 'EXPENSE'
          ? 'Erro ao cadastrar despesa!'
          : 'Erro ao cadastrar receita!'
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(
      (category) => category.type === transaction?.type
    );
  }, [categoriesList, transaction]);

  async function handleDeleteTransaction() {
    try {
      await removeTransaction(transaction!.id);

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success(
        transaction?.type === 'EXPENSE'
          ? 'Despensa removida com sucesso!'
          : 'Receita removida com sucesso!'
      );
      onClose();
    } catch {
      toast.error(
        transaction?.type === 'EXPENSE'
          ? 'Erro ao remover despesa!'
          : 'Erro ao remover receita!'
      );
    }
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  return {
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isLoading,
    isDeleteModalOpen,
    isLoadingDelete,
    handleDeleteTransaction,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
  };
}
