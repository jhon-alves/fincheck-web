import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services/transactions-services';
import { queryKeys } from './queryKeys';

export function useCalendar(month: number, year: number) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.calendar(month, year),
    queryFn: () => transactionsServices.getCalendar(month, year),
    placeholderData: keepPreviousData,
  });

  return { days: data ?? [], isLoading, isFetching };
}
