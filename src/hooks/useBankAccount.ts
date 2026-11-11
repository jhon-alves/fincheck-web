import { useQuery } from '@tanstack/react-query';
import { banksServices } from '../services/banks-services';
import { queryKeys } from './queryKeys';

export function useBankAccounts() {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: banksServices.getBanks,
  });

  return {
    accounts: data ?? [],
    isFetching,
    isLoading,
  };
}
