import { validateEmail, validatePassword } from './validation';

describe('validateEmail', () => {
  it('returns true for valid email, false for invalid or empty', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('no-at-sign')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('returns null for valid password', () => {
    expect(validatePassword('Ab1!@xx')).toBe(null);
  });

  it('returns error message for invalid (length, special, uppercase)', () => {
    expect(validatePassword('')).toBe(
      'Пароль должен содержать не менее 6 символов',
    );
    expect(validatePassword('Abcdef1!')).toBe(
      'Пароль должен содержать не менее 2 спецсимволов',
    );
    expect(validatePassword('abc123!@')).toBe(
      'Пароль должен содержать не менее одной заглавной буквы',
    );
  });
});
