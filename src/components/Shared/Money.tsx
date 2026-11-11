import { cn, formatCompactCurrency, formatCurrency } from '../../helpers';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';

interface MoneyProps {
  value: number;
  className?: string;
  /** Mostra "+" / "−" na frente. */
  sign?: '+' | '-' | 'auto';
  compact?: boolean;
  /** Ignora o modo privacidade (ex.: preview do formulário). */
  alwaysVisible?: boolean;
}

/**
 * Valor monetário em BRL com algarismos tabulares e respeitando o modo
 * privacidade (blur). Use sempre este componente para exibir dinheiro.
 */
export function Money({ value, className, sign, compact, alwaysVisible }: MoneyProps) {
  const { areValuesVisible } = useDashboard();
  const hidden = !alwaysVisible && !areValuesVisible;
  const formatted = compact ? formatCompactCurrency(Math.abs(value)) : formatCurrency(Math.abs(value));

  const prefix =
    sign === '+'
      ? '+ '
      : sign === '-'
        ? '− '
        : sign === 'auto' && value < 0
          ? '− '
          : value < 0
            ? '−'
            : '';

  return (
    <span
      className={cn(
        'money whitespace-nowrap transition-[filter] duration-200',
        hidden && 'blur-[6px] select-none',
        className,
      )}
      aria-hidden={hidden || undefined}
    >
      {prefix}
      {formatted}
    </span>
  );
}
