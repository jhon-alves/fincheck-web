import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/categories-services';
import { queryKeys } from './queryKeys';

export function useCategories() {
  const { data, isFetching } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
  });

  return {
    categories: data ?? [],
    isFetching,
  };
}
