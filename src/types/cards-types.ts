export type CardBrand =
  | 'VISA'
  | 'MASTERCARD'
  | 'ELO'
  | 'AMEX'
  | 'HIPERCARD'
  | 'DINERS'
  | 'DISCOVER'
  | 'JCB'
  | 'OTHER';

export type CardKind = 'CREDIT' | 'DEBIT';

export type Card = {
  id: string;
  name: string;
  holderName: string;
  lastDigits: string;
  brand: CardBrand;
  kind: CardKind;
  /** Id de um gradiente da paleta (`midnight`, `lime`...) ou hex. */
  color: string;
  expMonth: number;
  expYear: number;
  bankAccountId: string | null;
  bankAccount: { id: string; name: string; color: string } | null;
  creditLimit: number | null;
  closingDay: number | null;
  dueDay: number | null;
  archived: boolean;
  createdAt: string;
  /** Só crédito: compras ainda pendentes (inclui parcelas futuras). */
  usedLimit: number | null;
  availableLimit: number | null;
};

export type CardsResponse = Array<Card>;

/**
 * Nunca inclua o número completo nem o CVV aqui: só os 4 últimos dígitos e a
 * bandeira vão para a API.
 */
export type CardParams = {
  name: string;
  holderName: string;
  lastDigits: string;
  brand: CardBrand;
  kind: CardKind;
  color: string;
  expMonth: number;
  expYear: number;
  bankAccountId: string | null;
  creditLimit: number | null;
  closingDay: number | null;
  dueDay: number | null;
  archived?: boolean;
};

export type UpdateCardParams = CardParams & { id: string };
