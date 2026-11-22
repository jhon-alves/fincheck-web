import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/categories-services';
import { queryKeys } from './queryKeys';

/**
 * Telas que só usam nome, ícone e cor (filtros, selects) passam
 * `refetchOnMount: false`: a contagem de lançamentos pode estar desatualizada
 * ali sem problema. A tela de Categorias usa a contagem e usa o padrão.
 */
export function useCategories(options: { refetchOnMount?: boolean } = {}) {
  const { data, isFetching } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
    refetchOnMount: options.refetchOnMount,
  });

  return {
    categories: data ?? [],
    isFetching,
  };
}
