import { KeyboardEvent, memo } from 'react';
import { addDays, isToday } from 'date-fns';
import { CreditCard, Layers, Repeat } from 'lucide-react';
import { Money, Tooltip } from '../../../components/Shared';
import { cn, formatCurrency, formatLongDay } from '../../../helpers';
import { useDashboard } from '../../../components/Dashboard';
import type { CalendarCell } from '../useCalendarController';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface CalendarGridProps {
  cells: CalendarCell[];
  isLoading: boolean;
  onOpenDay: (date: Date) => void;
  onFocusDay: (date: Date) => void;
}

const DayCell = memo(function DayCell({
  cell,
  isFocusTarget,
  onOpenDay,
  onKeyDown,
}: {
  cell: CalendarCell;
  isFocusTarget: boolean;
  onOpenDay: (date: Date) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}) {
  const { areValuesVisible } = useDashboard();
  const { date, inMonth, data, intensity, dueCards } = cell;
  const today = isToday(date);
  const hasInstallments = !!data?.hasInstallments;
  const hasRecurring = !!data?.hasRecurring;

  // Heatmap sutil: até ~24% da cor de saída misturada ao fundo do card.
  const heat = Math.round(intensity * 24);
  const label = [
    formatLongDay(date),
    data?.expense ? `saídas ${formatCurrency(data.expense)}` : null,
    data?.income ? `entradas ${formatCurrency(data.income)}` : null,
    data?.count ? `${data.count} lançamento${data.count > 1 ? 's' : ''}` : 'sem lançamentos',
    hasInstallments ? 'com parcelas' : null,
    hasRecurring ? 'com lançamentos recorrentes' : null,
    dueCards.length ? `vencimento da fatura ${dueCards.map((c) => c.name).join(', ')}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <button
      type="button"
      role="gridcell"
      data-day={cell.key}
      tabIndex={isFocusTarget ? 0 : -1}
      aria-label={label}
      aria-current={today ? 'date' : undefined}
      onClick={() => onOpenDay(date)}
      onKeyDown={(event) => onKeyDown(event, date)}
      className={cn(
        'group relative flex min-h-16 flex-col rounded-xl border p-1.5 text-left transition-[background-color,border-color,transform] outline-none sm:min-h-24 sm:rounded-2xl sm:p-2.5',
        'hover:border-fg/20 focus-visible:ring-4 focus-visible:ring-ring active:scale-[0.98]',
        inMonth ? 'border-border' : 'border-transparent opacity-40',
      )}
      style={{
        backgroundColor:
          heat > 0 ? `color-mix(in oklab, var(--expense) ${heat}%, var(--card))` : 'var(--card)',
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={cn(
            'money grid size-6 place-items-center rounded-full text-xs font-semibold sm:size-7 sm:text-sm',
            today ? 'bg-primary text-on-primary' : 'text-fg',
          )}
        >
          {date.getDate()}
        </span>
        {/* No celular o grid compacto fica só com os pontinhos */}
        <span className="hidden items-center gap-1 sm:flex">
          {hasRecurring && <Repeat size={12} aria-hidden className="text-transfer-strong" />}
          {hasInstallments && <Layers size={12} aria-hidden className="text-muted" />}
          {dueCards.length > 0 && (
            <Tooltip label={`Vence: ${dueCards.map((card) => card.name).join(', ')}`}>
              <span className="grid size-5 place-items-center rounded-full bg-warning-soft text-warning-strong">
                <CreditCard size={11} aria-hidden />
              </span>
            </Tooltip>
          )}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-1">
        {data && data.expense > 0 ? (
          <Money
            value={data.expense}
            compact
            className={cn(
              'hidden truncate text-[11px] font-semibold sm:block sm:text-xs',
              intensity > 0.6 ? 'text-expense-strong' : 'text-fg-soft',
            )}
          />
        ) : (
          <span />
        )}
        {data && (
          <span className="flex shrink-0 gap-0.5" aria-hidden>
            {data.income > 0 && <span className="size-1.5 rounded-full bg-income sm:size-2" />}
            {data.expense > 0 && <span className="size-1.5 rounded-full bg-expense sm:size-2" />}
          </span>
        )}
      </div>
      {!areValuesVisible && data && <span className="sr-only">valores ocultos</span>}
    </button>
  );
});

export function CalendarGrid({ cells, isLoading, onOpenDay, onFocusDay }: CalendarGridProps) {
  const focusKey =
    cells.find((cell) => cell.inMonth && isToday(cell.date))?.key ??
    cells.find((cell) => cell.inMonth)?.key;

  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const step = moves[event.key];
    if (step === undefined) return;
    event.preventDefault();
    onFocusDay(addDays(date, step));
  }

  return (
    <div data-calendar-grid role="grid" aria-label="Calendário do mês" aria-busy={isLoading}>
      <div role="row" className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            role="columnheader"
            className="text-center text-[11px] font-semibold tracking-wide text-muted uppercase sm:text-xs"
          >
            {weekday}
          </span>
        ))}
      </div>
      <div role="rowgroup" className="grid grid-cols-7 gap-1 sm:gap-2">
        {weeks.map((week) => (
          // display: contents mantém o grid de 7 colunas com a semântica de linha
          <div key={week[0].key} role="row" className="contents">
            {week.map((cell) =>
              isLoading ? (
                <div
                  key={cell.key}
                  role="gridcell"
                  className="skeleton min-h-16 rounded-xl sm:min-h-24 sm:rounded-2xl"
                />
              ) : (
                <DayCell
                  key={cell.key}
                  cell={cell}
                  isFocusTarget={cell.key === focusKey}
                  onOpenDay={onOpenDay}
                  onKeyDown={handleKeyDown}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
