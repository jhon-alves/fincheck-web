import type { CardBrand, CardKind } from './cards-types';
import type { RecurrenceInfo, RecurrenceParams } from './recurring-types';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type PaymentMethod =
  | 'ACCOUNT'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PIX'
  | 'CASH';

/** Escopo de edição/exclusão de parcelas, como no Google Agenda. */
export type InstallmentScope = 'one' | 'following' | 'all';

export type Transaction = {
  id: string;
  name: string;
  value: number;
  /** ISO da API, sempre às 12:00 UTC — use `fromApiDate` para exibir. */
  date: string;
  type: TransactionType;
  paid: boolean;
  paymentMethod: PaymentMethod;
  bankAccountId: string | null;
  toBankAccountId: string | null;
  categoryId: string | null;
  cardId: string | null;
  installmentGroupId: string | null;
  installmentNumber: number | null;
  installmentsTotal: number | null;
  notes: string | null;
  /** Ocorrência de um lançamento recorrente (a regra é o molde). */
  recurringRuleId: string | null;
  occurrenceDate: string | null;
  /** Editada individualmente: a regra não a sobrescreve mais. */
  isDetached: boolean;
  recurringRule: RecurrenceInfo | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
    type: TransactionType;
    color: string | null;
  } | null;
  bankAccount: { id: string; name: string; color: string } | null;
  toBankAccount: { id: string; name: string; color: string } | null;
  card: {
    id: string;
    name: string;
    brand: CardBrand;
    lastDigits: string;
    color: string;
    kind: CardKind;
  } | null;
};

export type TransactionsFilters = {
  month?: number;
  year?: number;
  from?: string;
  to?: string;
  bankAccountId?: string;
  cardId?: string;
  categoryId?: string;
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  paid?: boolean;
  search?: string;
};

export type TransactionsResponse = Array<Transaction>;

type TransactionBody = {
  type: 'INCOME' | 'EXPENSE';
  name: string;
  /** `YYYY-MM-DD` */
  date: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  bankAccountId?: string | null;
  cardId?: string | null;
  paid: boolean;
  notes?: string | null;
};

export type CreateTransactionParams = TransactionBody & {
  /** Valor total; parcelado, o backend divide entre as parcelas. */
  totalValue: number;
  installments: number;
  /** Lançamento recorrente (não combina com parcelamento). */
  recurrence?: RecurrenceParams;
};

export type UpdateTransactionParams = TransactionBody & {
  id: string;
  /** Em parcelas, o valor de cada parcela. */
  value: number;
  scope?: InstallmentScope;
};

export type CalendarDay = {
  /** `YYYY-MM-DD` */
  date: string;
  income: number;
  expense: number;
  count: number;
  hasInstallments: boolean;
  hasRecurring: boolean;
};
