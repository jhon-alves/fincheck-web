import { useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services/transactions-services';
import { TransactionsFilters } from '../types/transactions-types';

export function useTransactions(filters: TransactionsFilters) {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsServices.getTransactions(filters),
  });

  return {
    transactions: data ?? [],
    isLoading: isFetching,
    isInitialLoading: isLoading,
    refetch,
  };
}
