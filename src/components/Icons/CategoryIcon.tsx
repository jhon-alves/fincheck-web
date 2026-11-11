import {
  ArrowLeftRight,
  BriefcaseBusiness,
  Bus,
  CircleDollarSign,
  Ellipsis,
  GraduationCap,
  House,
  Laptop,
  Plane,
  Popcorn,
  Shirt,
  ShoppingCart,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../helpers';
import type { TransactionType } from '../../types/transactions-types';
import { categoryColorVar, customCategoryIcons } from './categoryPalette';

/** Ícones das categorias padrão (pelo campo `icon` salvo no banco). */
const defaultCategoryIcons: Record<string, LucideIcon> = {
  salary: BriefcaseBusiness,
  freelance: Laptop,
  home: House,
  food: UtensilsCrossed,
  education: GraduationCap,
  fun: Popcorn,
  grocery: ShoppingCart,
  clothes: Shirt,
  transport: Bus,
  travel: Plane,
  other: Ellipsis,
};

const tones: Record<TransactionType, string> = {
  INCOME: 'bg-income-soft text-income-strong',
  EXPENSE: 'bg-expense-soft text-expense-strong',
  TRANSFER: 'bg-transfer-soft text-transfer-strong',
};

interface CategoryIconProps {
  type: TransactionType;
  icon?: string | null;
  /** Chave da paleta (categorias personalizadas). Sem ela, usa a cor do tipo. */
  color?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Resolve os ícones das padrão e o set das personalizadas. */
export function CategoryIcon({ type, icon, color, size = 'md', className }: CategoryIconProps) {
  const Icon =
    type === 'TRANSFER'
      ? ArrowLeftRight
      : (icon && (defaultCategoryIcons[icon] ?? customCategoryIcons[icon])) ||
        (type === 'INCOME' ? CircleDollarSign : Ellipsis);

  const colorVar = type === 'TRANSFER' ? null : categoryColorVar(color);

  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center',
        size === 'sm' && 'size-8 rounded-xl',
        size === 'md' && 'size-10 rounded-2xl',
        size === 'lg' && 'size-12 rounded-2xl',
        !colorVar && tones[type],
        className,
      )}
      style={
        colorVar
          ? {
              color: colorVar,
              backgroundColor: `color-mix(in oklab, ${colorVar} 15%, transparent)`,
            }
          : undefined
      }
    >
      <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 22} strokeWidth={1.9} />
    </span>
  );
}
