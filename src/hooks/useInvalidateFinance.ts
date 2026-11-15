import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export type FinanceList = 'bankAccounts' | 'cards' | 'categories';

const LIST_KEYS: Record<FinanceList, QueryKey> = {
  bankAccounts: queryKeys.bankAccounts,
  cards: queryKeys.cards,
  categories: queryKeys.categories,
};

/** Página que mostra os números de cada lista (saldos, limites, contagens). */
const LIST_PAGE: Record<FinanceList, string> = {
  bankAccounts: '/contas',
  cards: '/cartoes',
  categories: '/categorias',
};

/**
 * Depois de criar/editar/excluir lançamentos, tudo que depende deles fica
 * velho. Para não disparar uma requisição por lista a cada lançamento (com o
 * banco longe, cada uma pesa), a atualização é feita em duas partes:
 *
 * - Dados do período (lançamentos, calendário, dashboard, recorrências): só
 *   as consultas que estão na tela são buscadas de novo. As outras ficam
 *   marcadas como velhas e recarregam quando a página delas abrir.
 * - Contas, cartões e categorias: os nomes não mudam com um lançamento, só os
 *   números (saldo, limite usado, contagem). Só a página que mostra esses
 *   números busca de novo agora; nas outras a lista fica marcada como velha e
 *   as telas que só usam nomes (`refetchOnMount: false`) não a buscam.
 *
 * Use `refetch` quando a própria lista mudou (ex.: conta nova ou renomeada).
 */
export function useInvalidateFinance() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  return useCallback(
    (options: { refetch?: FinanceList[] } = {}) => {
      const periodKeys = [
        queryKeys.transactions(),
        queryKeys.calendar(),
        queryKeys.dashboard(),
        queryKeys.recurringRules,
      ];

      return Promise.all([
        ...periodKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        ...(Object.keys(LIST_KEYS) as FinanceList[]).map((list) =>
          queryClient.invalidateQueries({
            queryKey: LIST_KEYS[list],
            refetchType:
              pathname === LIST_PAGE[list] || options.refetch?.includes(list) ? 'active' : 'none',
          }),
        ),
      ]);
    },
    [queryClient, pathname],
  );
}
