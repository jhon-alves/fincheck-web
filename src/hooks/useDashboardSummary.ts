import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../services/dashboard-services';
import { queryKeys } from './queryKeys';

export function useDashboardSummary(month: number, year: number) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.dashboard(month, year),
    queryFn: () => getDashboardSummary(month, year),
    placeholderData: keepPreviousData,
  });

  return { summary: data, isLoading, isFetching };
}
