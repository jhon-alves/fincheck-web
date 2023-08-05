import { useState } from 'react';
import { useHome } from '../../../../contexts/HomeContext/useHome';

export function useTransactionsController() {
	const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
	const {
		areValuesVisible,
		handleNewAccountModalOpen,
		openNewTransactionModal,
		closeNewTransactionModal
	} = useHome();

	const handleIsFiltersModalOpen = () => {
		setIsFiltersModalOpen(!isFiltersModalOpen);
	};

	return {
		areValuesVisible,
		transactions: [],
		isInitialLoading: false,
		isLoading: false,
		isFiltersModalOpen,
		handleIsFiltersModalOpen,
		handleNewAccountModalOpen,
		openNewTransactionModal,
		closeNewTransactionModal
	};
}
