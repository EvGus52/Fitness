const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Проверка формата email (наличие @ и точки в домене).
 */
export function validateEmail(value: string): boolean {
  if (!value.trim()) return false;
  return EMAIL_REGEX.test(value);
}
