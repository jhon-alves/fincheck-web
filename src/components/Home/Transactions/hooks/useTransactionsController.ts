import { useState } from 'react';
import { useHome } from '../../../../contexts/HomeContext/useHome';

export function useTransactionsController() {
	const { areValuesVisible } = useHome();
	const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

	const handleIsFiltersModalOpen = () => {
		setIsFiltersModalOpen(!isFiltersModalOpen);
	};

	return {
		areValuesVisible,
		transactions: [],
		isInitialLoading: false,
		isLoading: false,
		isFiltersModalOpen,
		handleIsFiltersModalOpen
	};
}
