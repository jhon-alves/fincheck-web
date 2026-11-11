import { CreditCard, Keyboard, Layers, Repeat } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import { Card, Money } from '../../components/Shared';
import { MiniCard } from '../../components/Cards';
import { cn, formatDayHeading, fromApiDate } from '../../helpers';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDrawer } from './components/DayDrawer';
import { useCalendarController } from './useCalendarController';

export function CalendarPage() {
  const {
    cells,
    totals,
    isLoading,
    isFetching,
    dayDrawer,
    openDay,
    closeDay,
    focusDay,
    dueCardsFor,
  } = useCalendarController();

  const dueThisMonth = cells.filter((cell) => cell.dueCards.length > 0);

  return (
    <PageContainer className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <Card className={cn('p-2 transition-opacity sm:p-4', isFetching && !isLoading && 'opacity-80')}>
        <CalendarGrid
          cells={cells}
          isLoading={isLoading}
          onOpenDay={openDay}
          onFocusDay={focusDay}
        />

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-income" /> Entrada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-expense" /> Saída
          </span>
          <span className="flex items-center gap-1.5">
            <Repeat size={12} className="text-transfer-strong" /> Recorrente
          </span>
          <span className="flex items-center gap-1.5">
            <Layers size={12} className="text-muted" /> Parcela
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard size={12} className="text-warning-strong" /> Vencimento de fatura
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-10 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, var(--card), color-mix(in oklab, var(--expense) 24%, var(--card)))',
                border: '1px solid var(--border)',
              }}
            />
            Mais gasto
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Keyboard size={12} /> ← → trocam o mês
          </span>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-fg">Resumo do mês</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Entradas</dt>
              <dd>
                <Money value={totals.income} className="font-semibold text-income-strong" />
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Saídas</dt>
              <dd>
                <Money value={totals.expense} className="font-semibold text-expense-strong" />
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-2.5">
              <dt className="font-medium text-fg">Saldo</dt>
              <dd>
                <Money
                  value={totals.balance}
                  sign="auto"
                  className={cn('font-semibold', totals.balance < 0 ? 'text-expense-strong' : 'text-fg')}
                />
              </dd>
            </div>
          </dl>
        </Card>

        {totals.heaviest.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-fg">Dias mais pesados</h2>
            <ul className="mt-2 space-y-1">
              {totals.heaviest.map((day) => {
                const date = fromApiDate(day.date);

                return (
                  <li key={day.date}>
                    <button
                      type="button"
                      onClick={() => openDay(date)}
                      className="-mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm hover:bg-subtle"
                    >
                      <span className="text-fg-soft">{formatDayHeading(date)}</span>
                      <Money value={day.expense} className="font-semibold text-fg" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {dueThisMonth.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-fg">Faturas que vencem</h2>
            <ul className="mt-2 space-y-1">
              {dueThisMonth.flatMap((cell) =>
                cell.dueCards.map((card) => (
                  <li key={`${cell.key}-${card.id}`}>
                    <button
                      type="button"
                      onClick={() => openDay(cell.date)}
                      className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-subtle"
                    >
                      <MiniCard color={card.color} brand={card.brand} />
                      <span className="flex-1 truncate text-fg">{card.name}</span>
                      <span className="text-muted">dia {cell.date.getDate()}</span>
                    </button>
                  </li>
                )),
              )}
            </ul>
          </Card>
        )}
      </aside>

      <DayDrawer
        open={dayDrawer.open}
        date={dayDrawer.date}
        dueCards={dueCardsFor(dayDrawer.date)}
        onClose={closeDay}
      />
    </PageContainer>
  );
}
