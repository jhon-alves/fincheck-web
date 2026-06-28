import { useQuery } from '@tanstack/react-query';
import { banksServices } from '../services/banks-services';

export function useBankAccounts() {
  const { data, isFetching } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: banksServices.getBanks,
    staleTime: Infinity,
  });

  return {
    accounts: data ?? [],
    isFetching
  };
}
