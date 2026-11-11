import { RecurringRule } from '../types/recurring-types';
import { httpClient } from './httpClient';

export const recurringServices = {
  getRules,
  removeRule,
  changeStatus,
};

async function getRules() {
  const { data } = await httpClient.get<RecurringRule[]>('recurring-rules');
  return data;
}

/** Exclui a regra e as ocorrências previstas (as confirmadas ficam). */
async function removeRule(ruleId: string) {
  await httpClient.delete(`recurring-rules/${ruleId}`);
}

/** Encerra (a partir de `date`, padrão hoje), pausa ou reativa. */
async function changeStatus({
  ruleId,
  action,
  date,
}: {
  ruleId: string;
  action: 'end' | 'pause' | 'resume';
  date?: string;
}) {
  const { data } = await httpClient.post<RecurringRule>(`recurring-rules/${ruleId}/end`, {
    action,
    date,
  });
  return data;
}
