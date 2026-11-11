import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

/** Categoria mudou: nome/ícone/cor aparecem nas listas, no calendário e na Home. */
export function useInvalidateCategories() {
  const queryClient = useQueryClient();

  return useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() }),
      ]),
    [queryClient],
  );
}
