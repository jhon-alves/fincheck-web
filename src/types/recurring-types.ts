import type { Card } from './cards-types';
import type { Transaction, TransactionType } from './transactions-types';

export type RecurrenceFrequency = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type RecurrenceDayRule = 'FIXED_DAY' | 'BUSINESS_DAY';

/** Resumo da regra que vem junto de cada ocorrência. */
export type RecurrenceInfo = {
  id: string;
  frequency: RecurrenceFrequency;
  dayRule: RecurrenceDayRule;
  dayOfMonth: number | null;
  businessDayN: number | null;
  active: boolean;
  endDate: string | null;
  autoConfirm: boolean;
};

export type RecurrenceParams = {
  frequency: RecurrenceFrequency;
  dayRule: RecurrenceDayRule;
  dayOfMonth?: number | null;
  businessDayN?: number | null;
  /** `YYYY-MM-DD` */
  endDate?: string | null;
  maxOccurrences?: number | null;
  autoConfirm: boolean;
};

export type RecurringRuleStatus = 'ACTIVE' | 'PAUSED' | 'ENDED';

export type RecurringRule = RecurrenceInfo & {
  userId: string;
  type: Exclude<TransactionType, 'TRANSFER'>;
  name: string;
  value: number;
  categoryId: string | null;
  bankAccountId: string | null;
  cardId: string | null;
  paymentMethod: Transaction['paymentMethod'];
  startDate: string;
  maxOccurrences: number | null;
  notes: string | null;
  skippedDates: string[];
  createdAt: string;
  category: Transaction['category'];
  bankAccount: Transaction['bankAccount'];
  card: Pick<Card, 'id' | 'name' | 'brand' | 'lastDigits' | 'color' | 'kind'> | null;
  nextOccurrence: Transaction | null;
  /** Valor equivalente por mês (semanal × 52/12, anual ÷ 12). */
  monthlyEquivalent: number;
  status: RecurringRuleStatus;
};
