import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

/**
 * Depois de criar/editar/excluir lançamentos, tudo que depende deles fica
 * velho: listas, calendário, dashboard, saldos, limites dos cartões e a
 * contagem de lançamentos das categorias.
 */
export function useInvalidateFinance() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.cards }),
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts }),
      // As categorias trazem a contagem de lançamentos (usada na exclusão).
      queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringRules }),
    ]);
  }, [queryClient]);
}
