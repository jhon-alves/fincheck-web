import { useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services';

export function useTransactions() {
	const { data } = useQuery({
		queryKey: ['transactions'],
		queryFn: transactionsServices.findTransactions
	});

	return {
		transactions: data ?? []
	};
}
