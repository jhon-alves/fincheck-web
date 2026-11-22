import { cn } from '../../helpers';
import { BrandLogo } from '../Icons/brands';
import type { CardBrand } from '../../types/cards-types';
import { cardBackground, getCardTheme } from './cardThemes';

/**
 * Miniatura do cartão (selects, linhas do extrato, faturas). O tamanho `sm`
 * cabe ao lado de texto corrido e dentro de campos com rótulo flutuante.
 */
export function MiniCard({
  color,
  brand,
  size = 'md',
  className,
}: {
  color: string;
  brand: CardBrand;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const theme = getCardTheme(color);

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0 items-end justify-end overflow-hidden shadow-sm ring-1 ring-black/5',
        size === 'sm' ? 'h-4 w-6 rounded-[3px] p-[2px]' : 'h-6 w-9 rounded-[5px] p-[3px]',
        theme.ink === 'dark' ? 'text-ink-950' : 'text-white',
        className,
      )}
      style={{ background: cardBackground(theme) }}
    >
      <BrandLogo brand={brand} tone="mono" className={size === 'sm' ? 'h-1.5' : 'h-2.5'} />
    </span>
  );
}
