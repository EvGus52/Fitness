const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SPECIAL_CHAR_REGEX = /[^a-zA-Zа-яА-ЯёЁ0-9]/g;

export function validateEmail(value: string): boolean {
  if (!value.trim()) return false;
  return EMAIL_REGEX.test(value);
}

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
