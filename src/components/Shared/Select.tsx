import { ReactNode, useId } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../helpers';
import { FieldError } from './FieldError';

export type SelectOption = {
  value: string;
  label: string;
  /** Ícone/visual à esquerda (ex.: mini cartão com bandeira). */
  icon?: ReactNode;
  description?: string;
};

interface SelectProps {
  className?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

/** Select com rótulo flutuante: o `placeholder` vira o rótulo. */
export function Select({
  className,
  error,
  placeholder,
  options,
  onChange,
  value,
  disabled,
}: SelectProps) {
  const labelId = useId();
  const selected = options.find((option) => option.value === value);
  const hasValue = !!selected;

  return (
    <div>
      <div className="relative">
        <span
          id={labelId}
          className={cn(
            'pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted transition-all',
            hasValue && 'top-2 translate-y-0 text-xs',
          )}
        >
          {placeholder}
        </span>
        <RadixSelect.Root value={value ?? ''} onValueChange={onChange} disabled={disabled}>
          <RadixSelect.Trigger
            aria-labelledby={labelId}
            aria-invalid={!!error || undefined}
            className={cn(
              'relative flex h-[52px] w-full items-center gap-2 rounded-2xl border border-border bg-card px-3.5 text-left text-fg outline-none transition-[border-color,box-shadow]',
              'focus:border-fg/30 focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-50',
              hasValue && 'pt-4',
              error && 'border-expense!',
              className,
            )}
          >
            {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
            <span className="min-w-0 flex-1 truncate">
              <RadixSelect.Value>{selected?.label}</RadixSelect.Value>
            </span>
            <RadixSelect.Icon className="absolute top-1/2 right-3 -translate-y-1/2 text-muted">
              <ChevronDown size={18} />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={6}
              className={cn(
                'z-[95] max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-2xl border border-border bg-card-elevated shadow-float',
                'data-[side=bottom]:animate-slide-up-and-fade data-[side=top]:animate-slide-down-and-fade',
              )}
            >
              <RadixSelect.ScrollUpButton className="flex h-6 items-center justify-center text-muted">
                <ChevronUp size={16} />
              </RadixSelect.ScrollUpButton>
              <RadixSelect.Viewport className="p-1.5">
                {options.length === 0 && (
                  <p className="px-3 py-2.5 text-sm text-muted">Nenhuma opção disponível</p>
                )}
                {options.map((option) => (
                  <RadixSelect.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex cursor-pointer items-center gap-2.5 rounded-xl py-2 pr-9 pl-2.5 text-sm text-fg outline-none transition-colors select-none data-[highlighted]:bg-subtle data-[state=checked]:font-semibold"
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="min-w-0">
                      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                      {option.description && (
                        <span className="block truncate text-xs font-normal text-muted">
                          {option.description}
                        </span>
                      )}
                    </span>
                    <RadixSelect.ItemIndicator className="absolute right-3 text-primary-strong">
                      <Check size={16} />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
              <RadixSelect.ScrollDownButton className="flex h-6 items-center justify-center text-muted">
                <ChevronDown size={16} />
              </RadixSelect.ScrollDownButton>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
      </div>
      <FieldError message={error} />
    </div>
  );
}
