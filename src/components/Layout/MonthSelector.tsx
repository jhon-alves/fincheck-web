import { useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatMonthYear } from '../../helpers';
import { MONTHS } from '../../config/constants';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';
import { Popover, Spinner } from '../Shared';

/** ‹ Novembro 2026 › — o mês vale para todas as páginas. */
export function MonthSelector({ className }: { className?: string }) {
  const { selectedMonth, setSelectedMonth, goToPreviousMonth, goToNextMonth, goToCurrentMonth } =
    useDashboard();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedMonth.year);
  // Enquanto o mês novo carrega, a tela ainda mostra o anterior: o spinner
  // deixa claro que está atualizando.
  const isFetching = useIsFetching() > 0;

  const today = new Date();
  const label = formatMonthYear(new Date(selectedMonth.year, selectedMonth.month, 1));
  const isCurrentMonth =
    selectedMonth.month === today.getMonth() && selectedMonth.year === today.getFullYear();

  return (
    <div
      className={cn(
        'flex h-10 items-center rounded-full border border-border bg-card p-1 shadow-soft',
        className,
      )}
    >
      <button
        type="button"
        onClick={goToPreviousMonth}
        aria-label="Mês anterior"
        className="grid size-8 shrink-0 place-items-center rounded-full text-fg-soft transition-colors hover:bg-subtle hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronLeft size={18} />
      </button>

      <Popover.Root
        open={isPickerOpen}
        onOpenChange={(open) => {
          setIsPickerOpen(open);
          if (open) setPickerYear(selectedMonth.year);
        }}
      >
        <Popover.Trigger>
          <button
            type="button"
            aria-label={`Mês selecionado: ${label}. Escolher outro mês`}
            aria-busy={isFetching || undefined}
            className="relative flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-full px-2 text-sm font-semibold text-fg transition-colors hover:bg-subtle focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none sm:min-w-36"
          >
            <span aria-live="polite">{label}</span>
            <Spinner
              className={cn(
                'size-3.5 shrink-0 text-muted transition-opacity',
                isFetching ? 'opacity-100' : 'opacity-0',
              )}
            />
          </button>
        </Popover.Trigger>
        <Popover.Content className="w-72 p-3">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Ano anterior"
              onClick={() => setPickerYear((year) => year - 1)}
              className="grid size-8 place-items-center rounded-full text-fg-soft hover:bg-subtle"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="money text-sm font-semibold text-fg">{pickerYear}</span>
            <button
              type="button"
              aria-label="Próximo ano"
              onClick={() => setPickerYear((year) => year + 1)}
              className="grid size-8 place-items-center rounded-full text-fg-soft hover:bg-subtle"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((month, index) => {
              const isSelected =
                index === selectedMonth.month && pickerYear === selectedMonth.year;
              const isToday = index === today.getMonth() && pickerYear === today.getFullYear();

              return (
                <button
                  key={month}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedMonth({ month: index, year: pickerYear });
                    setIsPickerOpen(false);
                  }}
                  className={cn(
                    'h-10 rounded-xl text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'text-fg-soft hover:bg-subtle hover:text-fg',
                    isToday && !isSelected && 'ring-1 ring-primary-strong/50',
                  )}
                >
                  {month}
                </button>
              );
            })}
          </div>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => {
                goToCurrentMonth();
                setIsPickerOpen(false);
              }}
              className="mt-3 h-9 w-full rounded-xl text-sm font-semibold text-primary-strong hover:bg-subtle dark:text-primary"
            >
              Ir para o mês atual
            </button>
          )}
        </Popover.Content>
      </Popover.Root>

      <button
        type="button"
        onClick={goToNextMonth}
        aria-label="Próximo mês"
        className="grid size-8 shrink-0 place-items-center rounded-full text-fg-soft transition-colors hover:bg-subtle hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
