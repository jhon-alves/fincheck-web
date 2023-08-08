import { useState } from 'react';
import { useHome } from '../../../../contexts/HomeContext/useHome';
import { useTransactions } from '../../../../hooks/useTransactions';
import { TransactionsFilters } from '../../../../services/transactions/types';

export function useTransactionsController() {
	const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
	const [filters, setFilters] = useState<TransactionsFilters>({
		month: new Date().getMonth(),
		year: new Date().getFullYear()
	});

	const {
		areValuesVisible,
		handleNewAccountModalOpen,
		openNewTransactionModal,
		closeNewTransactionModal
	} = useHome();

	const {
		transactions,
		isLoading,
		isInitialLoading,
		refetchTransactions
	} = useTransactions(filters);

	// useEffect(() => {
	// 	refetchTransactions();
	// }, [filters, refetchTransactions]);

	function handleChangeFilters<TFilter extends keyof TransactionsFilters>(filter: TFilter) {
		return (value: TransactionsFilters[TFilter]) => {
			if (value === filters[filter]) return;

			setFilters(prevState => ({
				...prevState,
				[filter]: value,
			}));

			refetchTransactions();
		};
	}

	function handleApplyFilters({ bankAccountId, year }: { bankAccountId: string | undefined; year: number }) {
		handleChangeFilters('bankAccountId')(bankAccountId);
		handleChangeFilters('year')(year);

		handleIsFiltersModalOpen();
	}

	const handleIsFiltersModalOpen = () => {
		setIsFiltersModalOpen(!isFiltersModalOpen);
	};

	return {
		areValuesVisible,
		transactions,
		isInitialLoading,
		isLoading,
		isFiltersModalOpen,
		handleIsFiltersModalOpen,
		handleNewAccountModalOpen,
		openNewTransactionModal,
		closeNewTransactionModal,
		filters,
		handleChangeFilters,
		handleApplyFilters
	};
}
