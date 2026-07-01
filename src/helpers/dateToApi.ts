/**
 * Normaliza uma data para o "dia de calendário" que o usuário selecionou,
 * fixando o horário em meio-dia UTC.
 *
 * Isso evita o bug de fuso na virada de mês (ex.: uma transação de 30/06, em
 * UTC-3, virava 01/07T00:00Z e caía no filtro de julho) e garante que a data
 * renderize no mesmo dia em qualquer fuso realista (±11h em torno do meio-dia).
 */
export function dateToApi(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  ).toISOString();
}
