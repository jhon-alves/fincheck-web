import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHome } from '../../../../contexts/HomeContext/useHome';
import { bankAccountServices } from '../../../../services';
import { currencyStringToNumber } from '../../../../helpers';

const schema = z.object({
	initialBalance: z.union([
		z.string().nonempty('Saldo inicial é obrigatório'),
		z.number(),
	]),
	name: z.string().nonempty('Nome da conta é obrigatório'),
	type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
	color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useEditAccountModal() {
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const {
		isEditAccountModalOpen,
		closeEditAccountModal,
		accountBeingEdited
	} = useHome();

	const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: accountBeingEdited?.name,
			initialBalance: accountBeingEdited?.initialBalance,
			color: accountBeingEdited?.color,
			type: accountBeingEdited?.type
		}
	});

	const { mutateAsync: updateAsync, isLoading } = useMutation(bankAccountServices.updateAccount);
	const { mutateAsync: deleteAsync } = useMutation(bankAccountServices.deleteAccount);

	const handleUpdateAccount = handleSubmit(async(data) => {
		try {
			await updateAsync({
				...data,
				initialBalance: currencyStringToNumber(data.initialBalance),
				id: accountBeingEdited!.id
			});

			queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
			toast.success('Conta foi atualizada!');
			closeEditAccountModal();
		} catch {
			toast.error('Ocorreu um erro ao salvar alterações!');
		}
	});

	const handleDeleteAccount = handleSubmit(async(data) => {
		console.log(data);
		try {
			await deleteAsync(accountBeingEdited!.id);

			queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
			toast.success('Conta foi excluida!');
			closeEditAccountModal();
			handleOpenDeleteModal();
		} catch {
			toast.error('Ocorreu um erro ao excluir conta!');
		}
	});

	function handleOpenDeleteModal() {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	}

	return {
		isEditAccountModalOpen,
		closeEditAccountModal,
		register,
		errors,
		control,
		isLoading,
		handleUpdateAccount,
		handleDeleteAccount,
		accountBeingEdited,
		isDeleteModalOpen,
		handleOpenDeleteModal
	};
}
