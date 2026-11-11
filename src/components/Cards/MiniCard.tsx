import { cn } from '../../helpers';
import { BrandLogo } from '../Icons/brands';
import type { CardBrand } from '../../types/cards-types';
import { cardBackground, getCardTheme } from './cardThemes';

/** Miniatura do cartão (selects, linhas do extrato, faturas). */
export function MiniCard({
  color,
  brand,
  className,
}: {
  color: string;
  brand: CardBrand;
  className?: string;
}) {
  const theme = getCardTheme(color);

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex h-6 w-9 shrink-0 items-end justify-end overflow-hidden rounded-[5px] p-[3px] shadow-sm ring-1 ring-black/5',
        theme.ink === 'dark' ? 'text-ink-950' : 'text-white',
        className,
      )}
      style={{ background: cardBackground(theme) }}
    >
      <BrandLogo brand={brand} tone="mono" className="h-2.5" />
    </span>
  );
}
