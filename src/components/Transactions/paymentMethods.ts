import { Banknote, CreditCard, Landmark, QrCode, WalletCards, type LucideIcon } from 'lucide-react';
import type { PaymentMethod, TransactionType } from '../../types/transactions-types';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  ACCOUNT: 'Conta',
  PIX: 'Pix',
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
};

export const paymentMethodIcons: Record<PaymentMethod, LucideIcon> = {
  ACCOUNT: Landmark,
  PIX: QrCode,
  CASH: Banknote,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: WalletCards,
};

export const transactionTypeLabels: Record<TransactionType, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Saída',
  TRANSFER: 'Transferência',
};

/** Classe de cor do valor por tipo (versões "strong" passam de 4,5:1). */
export const amountToneClass: Record<TransactionType, string> = {
  INCOME: 'text-income-strong',
  EXPENSE: 'text-expense-strong',
  TRANSFER: 'text-transfer-strong',
};

export const amountSign: Record<TransactionType, '+' | '-' | undefined> = {
  INCOME: '+',
  EXPENSE: '-',
  TRANSFER: undefined,
};

export function paidLabel(type: TransactionType, paid: boolean) {
  if (!paid) return 'Pendente';
  if (type === 'INCOME') return 'Recebido';
  if (type === 'TRANSFER') return 'Concluída';
  return 'Pago';
}
