import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { capitalizeFirstLetter } from '../../helpers';

interface DatePickerProps {
  value: Date;
  onChange(date: Date): void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <DayPicker
      locale={ptBR}
      selected={value}
      defaultMonth={value}
      mode="single"
      onSelect={(date) => date && onChange(date)}
      components={{
        IconLeft: () => <ChevronLeft size={18} />,
        IconRight: () => <ChevronRight size={18} />,
      }}
      classNames={{
        months: 'flex',
        month: 'space-y-3',
        caption: 'flex items-center justify-between pl-2',
        nav: 'flex gap-1',
        nav_button:
          'grid size-8 place-items-center rounded-full text-fg-soft hover:bg-subtle',
        table: 'border-collapse',
        head_cell: 'pb-1 text-[11px] font-medium uppercase text-muted',
        cell: 'p-0.5',
        day: 'grid size-9 place-items-center rounded-full text-sm text-fg hover:bg-subtle money',
        day_today: 'font-bold text-primary-strong',
        day_selected: 'bg-primary! text-on-primary! font-semibold',
        day_outside: 'text-muted/50',
      }}
      formatters={{
        formatCaption: (date, options) => (
          <span className="text-sm font-semibold text-fg">
            {capitalizeFirstLetter(format(date, 'LLLL yyyy', options))}
          </span>
        ),
      }}
    />
  );
}
