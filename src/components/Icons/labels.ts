import type { BankAccount } from '../../types/bank-types';

export const accountTypeLabels: Record<BankAccount['type'], string> = {
  CHECKING: 'Conta corrente',
  INVESTMENT: 'Investimentos',
  CASH: 'Dinheiro físico',
};
