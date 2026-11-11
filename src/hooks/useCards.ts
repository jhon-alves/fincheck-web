import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardsServices } from '../services/cards-services';
import { queryKeys } from './queryKeys';

export function useCards() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.cards,
    queryFn: cardsServices.getCards,
  });

  const cards = useMemo(() => data ?? [], [data]);
  const activeCards = useMemo(
    () => cards.filter((card) => !card.archived),
    [cards],
  );

  return { cards, activeCards, isLoading, isFetching };
}
