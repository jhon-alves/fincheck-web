import { isAxiosError } from 'axios';

/** Mensagem de erro da API (`{ message }`) ou um texto padrão. */
export function apiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function apiErrorStatus(error: unknown) {
  return isAxiosError(error) ? error.response?.status : undefined;
}
