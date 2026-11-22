import type { Transaction } from './transactions-types';

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

/** Fatura de um cartão de crédito (GET /cards/:id/invoice). Datas em `YYYY-MM-DD`. */
export type CardInvoice = {
  cardId: string;
  dueDate: string;
  closingDate: string;
  /** Primeiro e último dia de compras que entram nesta fatura. */
  periodStart: string;
  periodEnd: string;
  total: number;
  pendingTotal: number;
  paidTotal: number;
  purchasesCount: number;
  pendingCount: number;
  /** Lançamentos INVOICE_PAYMENT que pagaram esta fatura. */
  payments: Transaction[];
};

/** Qual fatura: pelo mês do vencimento ou pela data de uma compra. */
export type InvoiceRef = { dueDate: string } | { purchaseDate: string };

export type PayInvoiceParams = {
  cardId: string;
  dueDate: string;
  bankAccountId: string;
  /** `YYYY-MM-DD` do pagamento. */
  date: string;
};
