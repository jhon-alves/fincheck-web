import {
  Card,
  CardInvoice,
  CardParams,
  CardsResponse,
  InvoiceRef,
  PayInvoiceParams,
  UpdateCardParams,
} from '../types/cards-types';
import type { Transaction } from '../types/transactions-types';
import { httpClient } from './httpClient';

export const cardsServices = {
  getCards,
  createCard,
  updateCard,
  removeCard,
  getInvoice,
  payInvoice,
};

async function getCards() {
  const { data } = await httpClient.get<CardsResponse>('cards', {
    params: { includeArchived: true },
  });
  return data;
}

async function createCard(params: CardParams) {
  const { data } = await httpClient.post<Card>('cards', params);
  return data;
}

async function updateCard({ id, ...params }: UpdateCardParams) {
  const { data } = await httpClient.put<Card>(`cards/${id}`, params);
  return data;
}

async function removeCard(cardId: string) {
  await httpClient.delete(`cards/${cardId}`);
}

async function getInvoice(cardId: string, ref: InvoiceRef) {
  const { data } = await httpClient.get<CardInvoice>(`cards/${cardId}/invoice`, { params: ref });
  return data;
}

/** Paga a fatura: cria o pagamento na conta e marca as compras como pagas. */
async function payInvoice({ cardId, ...params }: PayInvoiceParams) {
  const { data } = await httpClient.post<Transaction>(`cards/${cardId}/invoice/pay`, params);
  return data;
}
