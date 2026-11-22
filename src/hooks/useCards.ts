import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardsServices } from '../services/cards-services';
import { queryKeys } from './queryKeys';

/**
 * Telas que só usam nome, bandeira e dias do cartão (filtros, selects)
 * passam `refetchOnMount: false`: o limite usado pode estar desatualizado ali
 * sem problema. A tela de Cartões mostra os limites e usa o padrão.
 */
export function useCards(options: { refetchOnMount?: boolean } = {}) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.cards,
    queryFn: cardsServices.getCards,
    refetchOnMount: options.refetchOnMount,
  });

  const cards = useMemo(() => data ?? [], [data]);
  const activeCards = useMemo(
    () => cards.filter((card) => !card.archived),
    [cards],
  );

  return { cards, activeCards, isLoading, isFetching };
}
