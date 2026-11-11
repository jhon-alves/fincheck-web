import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services/transactions-services';
import { TransactionsFilters } from '../types/transactions-types';
import { queryKeys } from './queryKeys';

export function useTransactions(filters: TransactionsFilters, enabled = true) {
  const { data, isFetching, isLoading, isPlaceholderData } = useQuery({
    queryKey: queryKeys.transactions(filters),
    queryFn: () => transactionsServices.getTransactions(filters),
    placeholderData: keepPreviousData,
    enabled,
  });

  return {
    transactions: data ?? [],
    isFetching,
    isInitialLoading: isLoading,
    isPlaceholderData,
  };
}
