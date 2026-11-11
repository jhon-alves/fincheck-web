import { useMemo, useState } from 'react';
import { useCards } from '../../hooks';
import type { Card } from '../../types/cards-types';

export function useCardsController() {
  const { cards, activeCards, isLoading } = useCards();

  // `open` separado do cartão: o conteúdo continua na tela durante a
  // animação de saída do drawer.
  const [form, setForm] = useState<{ open: boolean; card: Card | null }>({
    open: false,
    card: null,
  });
  const [details, setDetails] = useState<{ open: boolean; cardId: string | null }>({
    open: false,
    cardId: null,
  });

  const archivedCards = useMemo(() => cards.filter((card) => card.archived), [cards]);
  const cardInDetails = cards.find((card) => card.id === details.cardId) ?? null;

  const creditSummary = useMemo(() => {
    const creditCards = activeCards.filter((card) => card.kind === 'CREDIT');
    const limit = creditCards.reduce((total, card) => total + (card.creditLimit ?? 0), 0);
    const used = creditCards.reduce((total, card) => total + (card.usedLimit ?? 0), 0);
    return { count: creditCards.length, limit, used, available: limit - used };
  }, [activeCards]);

  return {
    isLoading,
    activeCards,
    archivedCards,
    creditSummary,
    form,
    openNewCard: () => setForm({ open: true, card: null }),
    openEditCard: (card: Card) => {
      setDetails((prev) => ({ ...prev, open: false }));
      setForm({ open: true, card });
    },
    closeForm: () => setForm((prev) => ({ ...prev, open: false })),
    details: { open: details.open, card: cardInDetails },
    openDetails: (card: Card) => setDetails({ open: true, cardId: card.id }),
    closeDetails: () => setDetails((prev) => ({ ...prev, open: false })),
  };
}
