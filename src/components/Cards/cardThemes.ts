import type { CardBrand } from '../../types/cards-types';

/*
 * Paleta de gradientes dos cartões. O `id` é o que vai para o banco (campo
 * `color`), como as cores das contas — por isso os hex vivem aqui, num lugar
 * só, e não espalhados pelos componentes.
 */
export type CardTheme = {
  id: string;
  label: string;
  from: string;
  to: string;
  /** Cor do texto sobre o gradiente. */
  ink: 'light' | 'dark';
};

export const CARD_THEMES: CardTheme[] = [
  { id: 'midnight', label: 'Meia-noite', from: '#0B0D12', to: '#3A4150', ink: 'light' },
  { id: 'lime', label: 'Lima', from: '#E2FA9A', to: '#9BCB2E', ink: 'dark' },
  { id: 'violet', label: 'Violeta', from: '#3B0764', to: '#A855F7', ink: 'light' },
  { id: 'navy', label: 'Marinho', from: '#0F1654', to: '#3B5BDB', ink: 'light' },
  { id: 'ocean', label: 'Oceano', from: '#0C4A6E', to: '#22D3EE', ink: 'light' },
  { id: 'emerald', label: 'Esmeralda', from: '#022C22', to: '#10B981', ink: 'light' },
  { id: 'sunset', label: 'Pôr do sol', from: '#9A3412', to: '#FBBF24', ink: 'light' },
  { id: 'crimson', label: 'Carmim', from: '#4C0519', to: '#E11D48', ink: 'light' },
  { id: 'graphite', label: 'Grafite', from: '#18181B', to: '#71717A', ink: 'light' },
  { id: 'pearl', label: 'Pérola', from: '#FAFAFA', to: '#C4C4CC', ink: 'dark' },
  { id: 'rose', label: 'Rosé', from: '#FCE7F3', to: '#F472B6', ink: 'dark' },
];

/** Gradiente sugerido quando a bandeira é detectada. */
export const BRAND_THEME: Record<CardBrand, string> = {
  VISA: 'navy',
  MASTERCARD: 'midnight',
  ELO: 'graphite',
  AMEX: 'ocean',
  HIPERCARD: 'crimson',
  DINERS: 'navy',
  DISCOVER: 'sunset',
  JCB: 'emerald',
  OTHER: 'violet',
};

export const DEFAULT_CARD_THEME = 'midnight';

export function getCardTheme(color: string | null | undefined): CardTheme {
  const theme = CARD_THEMES.find((item) => item.id === color);
  if (theme) return theme;

  // Cor sólida em hex (cartões antigos/importados): gradiente monocromático.
  if (color && /^#[0-9a-f]{6}$/i.test(color)) {
    return { id: color, label: 'Personalizada', from: color, to: color, ink: 'light' };
  }

  return CARD_THEMES[0];
}

export function cardBackground(theme: CardTheme) {
  return `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`;
}
