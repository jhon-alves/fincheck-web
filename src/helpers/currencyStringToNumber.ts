/** "R$ 1.234,56" / "1.234,56" / 1234.56 → 1234.56 */
export function currencyStringToNumber(value: string | number) {
  if (typeof value === 'number') return value;

  const normalized = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return normalized ? Number(normalized) : NaN;
}
