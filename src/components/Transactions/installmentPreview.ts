import { addMonths } from 'date-fns';

/**
 * Mesma regra do backend: centavos truncados em cada parcela e a diferença na
 * última; a parcela i cai em addMonths(data, i - 1).
 */
export function previewInstallments(total: number, count: number, firstDate: Date) {
  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const lastCents = totalCents - baseCents * (count - 1);

  return Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    value: (index === count - 1 ? lastCents : baseCents) / 100,
    date: addMonths(firstDate, index),
  }));
}
