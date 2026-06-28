import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/categories-services';

export function useCategories() {
  const { data, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return {
    categories: data ?? [],
    isFetching
  };
}
