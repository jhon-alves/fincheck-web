import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../helpers';
import { Popover } from './Popover';
import { FieldError } from './FieldError';

/** Cores das contas (valor salvo no banco, por isso em hex). */
const ACCOUNT_COLORS = [
  '#868E96',
  '#FA5252',
  '#E64980',
  '#BE4BDB',
  '#7950F2',
  '#4C6EF5',
  '#228BE6',
  '#15AABF',
  '#12B886',
  '#40C057',
  '#82C91E',
  '#FAB005',
  '#FD7E14',
  '#212529',
];

interface ColorsDropdownInputProps {
  error?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorsDropdownInput({
  className,
  error,
  onChange,
  value,
}: ColorsDropdownInputProps) {
  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <button
            type="button"
            aria-invalid={!!error || undefined}
            className={cn(
              'relative h-[52px] w-full rounded-2xl border border-border bg-card px-3.5 text-left text-muted outline-none transition-[border-color,box-shadow]',
              'focus-visible:ring-4 focus-visible:ring-ring',
              error && 'border-expense!',
              className,
            )}
          >
            Cor
            <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
              {value ? (
                <span
                  className="size-6 rounded-full ring-2 ring-card ring-offset-1 ring-offset-border"
                  style={{ backgroundColor: value }}
                />
              ) : (
                <ChevronDown size={18} />
              )}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Content align="end" className="w-64 p-3">
          <div className="grid grid-cols-7 gap-2" role="listbox" aria-label="Cores">
            {ACCOUNT_COLORS.map((color) => (
              <Popover.Close asChild key={color}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === color}
                  aria-label={`Cor ${color}`}
                  onClick={() => onChange?.(color)}
                  className="grid size-7 place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring"
                  style={{ backgroundColor: color }}
                >
                  {value === color && <Check size={14} className="text-white" />}
                </button>
              </Popover.Close>
            ))}
          </div>
        </Popover.Content>
      </Popover.Root>

      <FieldError message={error} />
    </div>
  );
}
