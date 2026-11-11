import { Banknote, Landmark, TrendingUp } from 'lucide-react';
import { cn } from '../../helpers';
import type { BankAccount } from '../../types/bank-types';

const icons = {
  CHECKING: Landmark,
  INVESTMENT: TrendingUp,
  CASH: Banknote,
};


interface AccountTypeIconProps {
  type: BankAccount['type'];
  /** Cor da conta (dado salvo pelo usuário). */
  color: string;
  className?: string;
}

export function AccountTypeIcon({ type, color, className }: AccountTypeIconProps) {
  const Icon = icons[type];

  return (
    <span
      aria-hidden
      className={cn('grid size-10 shrink-0 place-items-center rounded-2xl', className)}
      style={{
        backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
        color,
      }}
    >
      <Icon size={18} strokeWidth={1.9} />
    </span>
  );
}
