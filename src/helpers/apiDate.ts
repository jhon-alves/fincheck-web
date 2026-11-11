/*
 * Datas da API são "dias de calendário". O front envia `YYYY-MM-DD` e a API
 * grava às 12:00 UTC desse dia. Na volta, usamos só a parte da data
 * (`2026-11-10T12:00:00.000Z` → 10/11 local), então o fuso nunca empurra um
 * lançamento para o dia vizinho.
 */

const pad = (value: number) => String(value).padStart(2, '0');

/** Date local → `YYYY-MM-DD` (o dia que o usuário vê no calendário). */
export function toApiDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `YYYY-MM-DD` ou ISO da API → Date local à meia-noite daquele dia. */
export function fromApiDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Chave estável de um dia (`YYYY-MM-DD`) para agrupar e comparar. */
export function dayKey(value: string | Date) {
  return typeof value === 'string' ? value.slice(0, 10) : toApiDate(value);
}
