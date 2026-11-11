import cardValidator from 'card-validator';
import type { CardBrand } from '../../types/cards-types';

const TYPE_TO_BRAND: Record<string, CardBrand> = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  'american-express': 'AMEX',
  'diners-club': 'DINERS',
  discover: 'DISCOVER',
  jcb: 'JCB',
  elo: 'ELO',
  hipercard: 'HIPERCARD',
};

const DEFAULT_GAPS = [4, 8, 12];

/**
 * Analisa o número digitado (só no front — ele nunca vai para a API).
 * O `card-validator` (Braintree) já resolve a ambiguidade da Elo, cujos BINs
 * começam com 4 ou 5: só devolve a bandeira quando sobra um candidato.
 */
export function analyzeCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  const result = cardValidator.number(digits);
  const card = result.card;

  const brand: CardBrand | null = card ? (TYPE_TO_BRAND[card.type] ?? 'OTHER') : null;
  const gaps = card?.gaps ?? DEFAULT_GAPS;
  const lengths = card?.lengths ?? [16];

  return {
    digits,
    brand,
    gaps,
    maxLength: card ? Math.max(...lengths) : 19,
    /** Tamanho "típico" para desenhar os placeholders do preview. */
    displayLength: card ? Math.min(...lengths) : 16,
    isValid: result.isValid,
    isPotentiallyValid: result.isPotentiallyValid,
  };
}

/** "4111111111111111" → "4111 1111 1111 1111" (respeita os grupos da bandeira). */
export function formatCardNumber(digits: string, gaps: number[] = DEFAULT_GAPS) {
  let output = '';

  for (let i = 0; i < digits.length; i++) {
    if (gaps.includes(i)) output += ' ';
    output += digits[i];
  }

  return output;
}

export type PreviewChar = { char: string; state: 'digit' | 'masked' | 'empty' } | { char: ' '; state: 'gap' };

/**
 * Número do preview: os 4 primeiros e os 4 últimos dígitos aparecem; o miolo
 * vira "•". Posições ainda não digitadas ficam como placeholder.
 */
export function previewCardNumber(digits: string, gaps: number[], length: number): PreviewChar[] {
  const total = Math.max(length, digits.length);
  const chars: PreviewChar[] = [];

  for (let i = 0; i < total; i++) {
    if (gaps.includes(i)) chars.push({ char: ' ', state: 'gap' });

    if (i >= digits.length) {
      chars.push({ char: '•', state: 'empty' });
    } else if (i < 4 || i >= total - 4) {
      chars.push({ char: digits[i], state: 'digit' });
    } else {
      chars.push({ char: '•', state: 'masked' });
    }
  }

  return chars;
}

/** "•••• •••• •••• 1234" para cartões já salvos (só temos o final). */
export function savedCardNumber(lastDigits: string, brand?: CardBrand | null) {
  if (brand === 'AMEX') return `•••• •••••• •${lastDigits}`;
  if (brand === 'DINERS') return `•••• •••••• ${lastDigits}`;
  return `•••• •••• •••• ${lastDigits}`;
}

export function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

export function isExpired(month: number, year: number, today = new Date()) {
  return year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1);
}
