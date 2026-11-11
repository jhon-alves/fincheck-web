import { Card, CardParams, CardsResponse, UpdateCardParams } from '../types/cards-types';
import { httpClient } from './httpClient';

export const cardsServices = {
  getCards,
  createCard,
  updateCard,
  removeCard,
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
