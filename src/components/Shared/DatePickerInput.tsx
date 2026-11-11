import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DatePicker } from './DatePicker';
import { FieldError } from './FieldError';
import { cn, formatDate } from '../../helpers';

interface DatePickerInputProps {
  error?: string;
  className?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
}

export function DatePickerInput({
  className,
  error,
  value,
  onChange,
  label = 'Data',
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ?? new Date();

  return (
    <div>
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <button
            type="button"
            aria-invalid={!!error || undefined}
            className={cn(
              'relative h-[52px] w-full rounded-2xl border border-border bg-card px-3.5 pt-4 text-left text-fg outline-none transition-[border-color,box-shadow]',
              'focus-visible:ring-4 focus-visible:ring-ring',
              error && 'border-expense!',
              className,
            )}
          >
            <span className="pointer-events-none absolute top-2 left-3.5 text-xs text-muted">
              {label}
            </span>
            <span className="money">{formatDate(selectedDate)}</span>
            <CalendarDays
              size={18}
              aria-hidden
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
            />
          </button>
        </RadixPopover.Trigger>

        <RadixPopover.Portal>
          <RadixPopover.Content
            sideOffset={6}
            align="start"
            className="z-[95] rounded-2xl border border-border bg-card-elevated p-3 shadow-float data-[side=bottom]:animate-slide-up-and-fade data-[side=top]:animate-slide-down-and-fade"
          >
            <DatePicker
              value={selectedDate}
              onChange={(date) => {
                onChange?.(date);
                setOpen(false);
              }}
            />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>

      <FieldError message={error} />
    </div>
  );
}
