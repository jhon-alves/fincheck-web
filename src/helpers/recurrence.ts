import { addMonths, addWeeks, addYears, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fromApiDate, toApiDate } from './apiDate';
import type {
  RecurrenceDayRule,
  RecurrenceFrequency,
} from '../types/recurring-types';

/*
 * Mesmas regras da API (src/modules/recurring), usadas aqui só para o preview
 * do formulário: N-ésimo dia útil (seg–sex, sem feriados nacionais fixos,
 * Carnaval, Sexta-feira Santa e Corpus Christi) e dia fixo (31 = último dia).
 */

function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const FIXED = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25'];

function holidays(year: number) {
  const easter = easterSunday(year);
  const shift = (days: number) =>
    toApiDate(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + days));
  return new Set([...FIXED.map((md) => `${year}-${md}`), shift(-48), shift(-47), shift(-2), shift(60)]);
}

export function nthBusinessDay(year: number, month: number, n: number) {
  const days = holidays(year);
  let last = new Date(year, month, 1);
  let count = 0;

  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) break;
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6 || days.has(toApiDate(date))) continue;
    count += 1;
    last = date;
    if (count === n) return date;
  }

  return last;
}

function clampedDay(year: number, month: number, day: number) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

type ScheduleInput = {
  frequency: RecurrenceFrequency;
  dayRule: RecurrenceDayRule;
  dayOfMonth?: number | null;
  businessDayN?: number | null;
};

/** Próximas `count` datas a partir de `start` (inclusive), como a API gera. */
export function previewRecurrence(schedule: ScheduleInput, start: Date, count = 4) {
  const first = startOfDay(start);
  const dates: Date[] = [];

  for (let index = 0; dates.length < count && index < 60; index++) {
    let date: Date;

    if (schedule.frequency === 'WEEKLY') {
      date = addWeeks(first, index);
    } else if (schedule.frequency === 'YEARLY') {
      const base = addYears(first, index);
      date = clampedDay(base.getFullYear(), first.getMonth(), schedule.dayOfMonth ?? first.getDate());
    } else {
      const base = addMonths(new Date(first.getFullYear(), first.getMonth(), 1), index);
      date =
        schedule.dayRule === 'BUSINESS_DAY'
          ? nthBusinessDay(base.getFullYear(), base.getMonth(), schedule.businessDayN ?? 1)
          : clampedDay(base.getFullYear(), base.getMonth(), schedule.dayOfMonth ?? first.getDate());
    }

    if (date >= first) dates.push(date);
  }

  return dates;
}

/** "Todo dia 5", "Todo 5º dia útil", "Toda semana (sáb)", "Todo ano em 10 mar". */
export function describeRecurrence(schedule: ScheduleInput, startDate?: string | Date | null) {
  const start =
    typeof startDate === 'string' ? fromApiDate(startDate) : (startDate ?? null);

  if (schedule.frequency === 'WEEKLY') {
    return start ? `Toda semana (${format(start, 'EEE', { locale: ptBR })})` : 'Toda semana';
  }

  if (schedule.frequency === 'YEARLY') {
    const day = schedule.dayOfMonth ?? start?.getDate();
    return start && day
      ? `Todo ano em ${day} ${format(start, 'MMM', { locale: ptBR })}`
      : 'Todo ano';
  }

  if (schedule.dayRule === 'BUSINESS_DAY') {
    return `Todo ${schedule.businessDayN ?? 1}º dia útil`;
  }

  const day = schedule.dayOfMonth ?? start?.getDate();
  return day === 31 ? 'Todo último dia do mês' : `Todo dia ${day}`;
}

/** A data da ocorrência já chegou (pode ser confirmada). */
export function isDueOrPast(apiDate: string, today = new Date()) {
  return apiDate.slice(0, 10) <= toApiDate(today);
}
