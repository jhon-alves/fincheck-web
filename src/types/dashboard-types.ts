import type { Card, CardBrand } from './cards-types';
import type { Transaction } from './transactions-types';

export type MonthTotals = {
  income: number;
  expense: number;
  savings: number;
  openInvoices: number;
};

export type DashboardSummary = {
  totalBalance: number;
  current: MonthTotals;
  previous: MonthTotals;
  expensesByCategory: Array<{
    categoryId: string | null;
    name: string;
    icon: string;
    color: string | null;
    total: number;
  }>;
  history: Array<{
    year: number;
    month: number;
    income: number;
    expense: number;
  }>;
  cards: Card[];
  upcoming: {
    transactions: Transaction[];
    invoices: Array<{
      cardId: string;
      cardName: string;
      brand: CardBrand;
      lastDigits: string;
      color: string;
      /** `YYYY-MM-DD` */
      dueDate: string;
      closingDate: string;
      amount: number;
    }>;
  };
  recentTransactions: Transaction[];
  /** Ocorrências de lançamentos recorrentes no mês. */
  fixed: {
    transactions: Transaction[];
    income: number;
    expense: number;
    confirmed: number;
  };
};
