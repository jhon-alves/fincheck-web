import { useQuery } from '@tanstack/react-query';
import { cardsServices } from '../services/cards-services';
import type { InvoiceRef } from '../types/cards-types';
import { queryKeys } from './queryKeys';

/** Fatura de um cartão de crédito, pelo mês do vencimento ou pela data de uma compra. */
export function useCardInvoice(cardId: string | null | undefined, ref: InvoiceRef | null, enabled = true) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.invoice(cardId ?? undefined, ref ?? undefined),
    queryFn: () => cardsServices.getInvoice(cardId!, ref!),
    enabled: enabled && !!cardId && !!ref,
  });

  return { invoice: data, isLoading, isFetching };
}
