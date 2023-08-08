import { useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services';
import { TransactionsFilters } from '../services/transactions/types';

export function useTransactions(filters: TransactionsFilters) {
	const { data, isFetching, isInitialLoading, refetch } = useQuery({
		queryKey: ['transactions'],
		queryFn: () => transactionsServices.findTransactions(filters),
	});

	return {
		transactions: data ?? [],
		isLoading: isFetching,
		isInitialLoading,
		refetchTransactions: refetch
	};
}
