import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHome } from '../../../../contexts/HomeContext/useHome';
import { useAccounts, useCategories } from '../../../../hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsServices } from '../../../../services';
import { toast } from 'react-hot-toast';
import { currencyStringToNumber } from '../../../../helpers';

const schema = z.object({
	value: z.string().nonempty('Informe o valor'),
	name: z.string().nonempty('Informe o nome'),
	categoryId: z.string().nonempty('Infome a categoria'),
	bankAccountId: z.string().nonempty('Informe o banco'),
	date: z.date()
});

type FormData = z.infer<typeof schema>;

export function useTransactionModal() {
	const queryClient = useQueryClient();

	const {
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal,
	} = useHome();

	const { accounts } = useAccounts();
	const { categories } = useCategories();

	const { mutateAsync, isLoading } = useMutation(transactionsServices.createTransaction);

	const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			date: new Date()
		}
	});

	const handleNewTransaction = handleSubmit(async data => {
		console.log(data);
		try {
			await mutateAsync({
				...data,
				value: currencyStringToNumber(data.value),
				type: newTransactionType!,
				date: data.date.toISOString()
			});

			queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
			toast.success(
				newTransactionType === 'EXPENSE'
					? 'Despesa cadastrada!'
					: 'Receita cadastrada!'
			);

			closeNewTransactionModal();
			reset();
		} catch {
			toast.error(
				newTransactionType === 'EXPENSE'
					? 'Ocorreu um erro ao cadastrar despesa!'
					: 'Ocorreu um erro ao cadastrar receita!'
			);
		}
	});

	const categoriesList = useMemo(() => {
		return categories.filter(category => category.type === newTransactionType);
	}, [categories, newTransactionType]);

	return {
		control,
		errors,
		accounts,
		categoriesList,
		isLoading,

		// New Transaction
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal,
		handleNewTransaction
	};
}
