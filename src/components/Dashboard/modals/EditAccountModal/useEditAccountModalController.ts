import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboard } from '../../DashboardContext/useDashboard';
import { BankAccountsService } from '../../../../services';
import { currencyStringToNumber } from '../../../../helpers';

const schema = z.object({
  name: z.string().nonempty('Nome da conta é obrigatório'),
  initialBalance: z.union([
    z.string().nonempty('Saldo inicial é obrigatório'),
    z.number(),
  ]),
  type: z.enum(['CHECKING', 'CASH', 'INVESTMENT']),
  color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useEditAccountController() {
  const { isEditAccountModalOpen, closeEditAccountModal, accountBeingEdited } =
    useDashboard();

  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: accountBeingEdited?.color,
      initialBalance: accountBeingEdited?.initialBalance,
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { isLoading, mutateAsync: updateAccount } = useMutation(
    BankAccountsService.update
  );
  const { isLoading: isLoadingDelete, mutateAsync: removeAccount } =
    useMutation(BankAccountsService.remove);

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await updateAccount({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
        id: accountBeingEdited!.id,
      });

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Conta editada com sucesso!');
      closeEditAccountModal();
    } catch (error) {
      toast.error('Erro ao editar conta');
    }
  });

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteAccount() {
    try {
      await removeAccount(accountBeingEdited!.id);

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Conta removida com sucesso!');
      closeEditAccountModal();
    } catch (error) {
      toast.error('Erro ao remover conta');
    }
  }

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    handleOpenDeleteModal,
    handleDeleteAccount,
    isLoadingDelete,
  };
}
