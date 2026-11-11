import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('pt-BR').format(date);
}

/** "Novembro 2026" */
export function formatMonthYear(date: Date) {
  return capitalizeFirstLetter(format(date, 'LLLL yyyy', { locale: ptBR }));
}

/** "nov/2026" */
export function formatShortMonthYear(date: Date) {
  return format(date, 'MMM/yyyy', { locale: ptBR });
}

/** Cabeçalho de grupo do extrato: "Hoje", "Ontem" ou "Seg, 10 nov". */
export function formatDayHeading(date: Date) {
  if (isToday(date)) return 'Hoje';
  if (isYesterday(date)) return 'Ontem';

  const label = format(date, 'EEE, d MMM', { locale: ptBR }).replace('.', '');
  return capitalizeFirstLetter(label);
}

/** "Terça, 10 de novembro" */
export function formatLongDay(date: Date) {
  const label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  return capitalizeFirstLetter(label.replace('-feira', ''));
}

/** "hoje", "amanhã", "em 3 dias", "há 2 dias" */
export function formatRelativeDay(date: Date, today = new Date()) {
  const diff = differenceInCalendarDays(date, today);

  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  if (diff === -1) return 'ontem';
  if (diff > 1) return `em ${diff} dias`;
  return `há ${Math.abs(diff)} dias`;
}
