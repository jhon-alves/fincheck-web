import { useHome } from '../../../../contexts/HomeContext/useHome';

export function useTransactionsController() {
	const { areValuesVisible } = useHome();

	return {
		areValuesVisible,
		transactions: [],
		isInitialLoading: false,
		isLoading: false
	};
}
