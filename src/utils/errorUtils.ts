import { AxiosError } from 'axios';
import type { ApiErrorBody } from '@/sharedTypes/sharedTypes';

export type { ApiErrorBody } from '@/sharedTypes/sharedTypes';

/**
 * Проверяет, является ли ошибка сетевой (нет ответа от сервера, обрыв соединения).
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.message === 'Network Error') return true;
    const code = (error as { code?: string }).code;
    if (code === 'ERR_NETWORK') return true;
  }
  if (error instanceof AxiosError && error.request && !error.response) {
    return true;
  }
  return false;
}

/**
 * Извлекает сообщение об ошибке из ответа Axios (response.data.message) или возвращает fallback.
 */
export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorBody;
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}

/**
 * Возвращает сообщение для показа в toast: при сетевой ошибке — «Пропал интернет», иначе — из API или fallback.
 */
export function getAxiosErrorToastMessage(
  error: unknown,
  fallback: string,
): string {
  if (isNetworkError(error)) {
    return 'Пропал интернет';
  }
  return getAxiosErrorMessage(error, fallback);
}
