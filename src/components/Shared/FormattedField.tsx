import { useId } from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { cn } from '../../helpers';
import { FieldError } from './FieldError';

/*
 * Campos formatados (moeda, máscara) com o mesmo visual do <Input>: rótulo
 * flutuante, raio 16px e mensagem de erro embaixo.
 */

const fieldClass = (error?: string) =>
  cn(
    'peer h-[52px] w-full rounded-2xl border border-border bg-card px-3.5 pt-4 text-fg outline-none transition-[border-color,box-shadow]',
    'placeholder-shown:pt-0 focus:border-fg/30 focus-visible:ring-4 focus-visible:ring-ring money',
    error && 'border-expense!',
  );

const labelClass =
  'pointer-events-none absolute top-2 left-3.5 text-xs text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs';

interface CurrencyFieldProps {
  label: string;
  value?: string | number | null;
  onChange?: (value: string) => void;
  error?: string;
}

export function CurrencyField({ label, value, onChange, error }: CurrencyFieldProps) {
  const id = useId();

  return (
    <div>
      <div className="relative">
        <NumericFormat
          id={id}
          value={value ?? ''}
          onChange={(event) => onChange?.(event.target.value)}
          inputMode="decimal"
          prefix="R$ "
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          placeholder=" "
          aria-invalid={!!error || undefined}
          className={fieldClass(error)}
        />
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      </div>
      <FieldError message={error} />
    </div>
  );
}

interface MaskedFieldProps {
  label: string;
  format: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text';
}

export function MaskedField({
  label,
  format,
  value,
  onChange,
  error,
  autoComplete = 'off',
  inputMode = 'numeric',
}: MaskedFieldProps) {
  const id = useId();

  return (
    <div>
      <div className="relative">
        <PatternFormat
          id={id}
          format={format}
          value={value ?? ''}
          onChange={(event) => onChange?.(event.target.value)}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={!!error || undefined}
          className={fieldClass(error)}
        />
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      </div>
      <FieldError message={error} />
    </div>
  );
}
