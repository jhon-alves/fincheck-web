import { useQuery } from '@tanstack/react-query';
import { recurringServices } from '../services/recurring-services';
import { queryKeys } from './queryKeys';

export function useRecurringRules(enabled = true) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.recurringRules,
    queryFn: recurringServices.getRules,
    enabled,
  });

  return { rules: data ?? [], isLoading, isFetching };
}
