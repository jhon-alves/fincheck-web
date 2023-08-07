import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHome } from '../../../../contexts/HomeContext/useHome';
import { bankAccountServices } from '../../../../services';
import { currencyStringToNumber } from '../../../../helpers';

const schema = z.object({
	initialBalance: z.string().nonempty('Saldo inicial é obrigatório'),
	name: z.string().nonempty('Nome da conta é obrigatório'),
	type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
	color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useAccountModal() {
	const queryClient = useQueryClient();
	const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema)
	});
	const {
		isNewAccountModalOpen,
		handleNewAccountModalOpen
	} = useHome();

	const { mutateAsync, isLoading } = useMutation(bankAccountServices.createAccount);

	const handleCreateAccountSubmit = handleSubmit(async(data) => {
		try {
			await mutateAsync({
				...data,
				initialBalance: currencyStringToNumber(data.initialBalance),
			});

			queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
			toast.success('Conta foi cadastrada!');
			handleNewAccountModalOpen();
			reset();
		} catch {
			toast.error('Ocorreu um erro ao cadastrar conta!');
		}
	});

	return {
		isNewAccountModalOpen,
		handleNewAccountModalOpen,
		register,
		errors,
		control,
		isLoading,
		handleCreateAccountSubmit
	};
}
