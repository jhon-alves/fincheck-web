import { toApiDate } from '../helpers/apiDate';
import { DashboardSummary } from '../types/dashboard-types';
import { httpClient } from './httpClient';

/** `month` vai de 0 a 11. "Hoje" vai no fuso do usuário. */
export async function getDashboardSummary(month: number, year: number) {
  const { data } = await httpClient.get<DashboardSummary>('dashboard/summary', {
    params: { month, year, today: toApiDate(new Date()) },
  });
  return data;
}
