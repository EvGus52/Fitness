const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Спецсимволы: не буква и не цифра. */
const SPECIAL_CHAR_REGEX = /[^a-zA-Zа-яА-ЯёЁ0-9]/g;

/**
 * Проверка формата email (наличие @ и точки в домене).
 */
export function validateEmail(value: string): boolean {
  if (!value.trim()) return false;
  return EMAIL_REGEX.test(value);
}

/**
 * Валидация пароля по требованиям API.
 * Требования: не менее 6 символов, не менее 2 спецсимволов, не менее одной заглавной буквы.
 * @returns Сообщение об ошибке или null, если пароль подходит.
 */
export function validatePassword(value: string): string | null {
  if (!value.trim()) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  if (value.length < 6) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  const specialMatches = value.match(SPECIAL_CHAR_REGEX);
  const specialCount = specialMatches ? specialMatches.length : 0;
  if (specialCount < 2) {
    return 'Пароль должен содержать не менее 2 спецсимволов';
  }
  if (!/[A-ZА-ЯЁ]/.test(value)) {
    return 'Пароль должен содержать не менее одной заглавной буквы';
  }
  return null;
}
