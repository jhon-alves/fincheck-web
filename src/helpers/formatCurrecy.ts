const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const compactFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

/** Valor curto para espaços pequenos: "R$ 1,2 mil", "R$ 35". */
export function formatCompactCurrency(value: number) {
  if (Math.abs(value) < 1000) {
    return currencyFormatter.format(Math.round(value)).replace(/,00$/, '');
  }

  return compactFormatter.format(value);
}

/** Variação percentual entre dois valores; `null` quando não há base. */
export function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}
