import { NumericFormat } from 'react-number-format';
import { cn } from '../../helpers';
import { FieldError } from './FieldError';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
  autoFocus?: boolean;
}

export function InputCurrency({
  error,
  onChange,
  value,
  className,
  autoFocus,
  'aria-label': ariaLabel = 'Valor',
}: InputCurrencyProps) {
  return (
    <div className="min-w-0 flex-1">
      <NumericFormat
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
        inputMode="decimal"
        aria-label={ariaLabel}
        aria-invalid={!!error || undefined}
        autoFocus={autoFocus}
        className={cn(
          'money w-full bg-transparent text-[32px] font-semibold tracking-tight text-fg outline-none placeholder:text-muted/60',
          error && 'text-expense-strong',
          className,
        )}
        placeholder="0,00"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
      />

      <FieldError message={error} />
    </div>
  );
}
