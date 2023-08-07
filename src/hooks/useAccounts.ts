import { useQuery } from '@tanstack/react-query';
import { bankAccountServices } from '../services';

export function useAccounts() {
	const { data, isFetching } = useQuery({
		queryKey: ['bankAccounts'],
		queryFn: bankAccountServices.findAllAccounts
	});

	return {
		accounts: data ?? [],
		isFetching
	};
}
