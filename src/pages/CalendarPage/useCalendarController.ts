import { useEffect, useMemo, useState } from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useDashboard } from '../../components/Dashboard';
import { dayKey } from '../../helpers';
import { useCalendar, useCards } from '../../hooks';
import type { Card } from '../../types/cards-types';
import type { CalendarDay } from '../../types/transactions-types';

export type CalendarCell = {
  date: Date;
  key: string;
  inMonth: boolean;
  data: CalendarDay | null;
  /** 0..1, proporcional ao maior gasto do mês (heatmap). */
  intensity: number;
  dueCards: Card[];
};

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) return false;
  return (
    element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) ||
    !!element.closest('[role="dialog"], [role="alertdialog"], [role="listbox"], [role="menu"]')
  );
}

export function useCalendarController() {
  const { selectedMonth, goToNextMonth, goToPreviousMonth, setSelectedMonth } = useDashboard();
  const { days, isLoading, isFetching } = useCalendar(selectedMonth.month, selectedMonth.year);
  const { activeCards } = useCards();
  const [dayDrawer, setDayDrawer] = useState<{ open: boolean; date: Date | null }>({
    open: false,
    date: null,
  });

  const monthStart = useMemo(
    () => new Date(selectedMonth.year, selectedMonth.month, 1),
    [selectedMonth.year, selectedMonth.month],
  );

  // ← → trocam o mês (fora de campos de texto e de drawers abertos).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (isTypingTarget(event.target)) return;
      if ((event.target as HTMLElement).closest?.('[data-calendar-grid]')) return;

      event.preventDefault();
      if (event.key === 'ArrowLeft') goToPreviousMonth();
      else goToNextMonth();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToNextMonth, goToPreviousMonth]);

  const cells = useMemo<CalendarCell[]>(() => {
    const start = startOfWeek(startOfMonth(monthStart), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 });
    const byDay = new Map(days.map((day) => [day.date, day]));
    const maxExpense = Math.max(0, ...days.map((day) => day.expense));
    const lastDay = endOfMonth(monthStart).getDate();

    return eachDayOfInterval({ start, end }).map((date) => {
      const key = dayKey(date);
      const inMonth = isSameMonth(date, monthStart);
      const data = inMonth ? (byDay.get(key) ?? null) : null;

      // Vencimento de fatura: dia `dueDay`, limitado ao fim do mês.
      const dueCards = inMonth
        ? activeCards.filter(
            (card) =>
              card.kind === 'CREDIT' &&
              card.dueDay != null &&
              Math.min(card.dueDay, lastDay) === date.getDate(),
          )
        : [];

      return {
        date,
        key,
        inMonth,
        data,
        intensity: data && maxExpense > 0 ? data.expense / maxExpense : 0,
        dueCards,
      };
    });
  }, [days, activeCards, monthStart]);

  const totals = useMemo(() => {
    const income = days.reduce((total, day) => total + day.income, 0);
    const expense = days.reduce((total, day) => total + day.expense, 0);
    const heaviest = [...days].sort((a, b) => b.expense - a.expense).filter((d) => d.expense > 0).slice(0, 3);
    return { income, expense, balance: income - expense, heaviest };
  }, [days]);

  function openDay(date: Date) {
    setDayDrawer({ open: true, date });
  }

  /** Navegação por teclado dentro do grid; atravessar a borda troca o mês. */
  function focusDay(date: Date) {
    if (!isSameMonth(date, monthStart)) {
      setSelectedMonth({ month: date.getMonth(), year: date.getFullYear() });
    }
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-day="${dayKey(date)}"]`)?.focus();
    });
  }

  return {
    monthStart,
    cells,
    totals,
    isLoading,
    isFetching,
    dayDrawer,
    openDay,
    closeDay: () => setDayDrawer((prev) => ({ ...prev, open: false })),
    focusDay,
    dueCardsFor: (date: Date | null) =>
      date ? (cells.find((cell) => cell.key === dayKey(date))?.dueCards ?? []) : [],
  };
}
