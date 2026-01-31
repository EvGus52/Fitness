'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './authModal.module.css';

import { regUser } from '@/services/auth/regApi';
import { loginUser, saveToken } from '@/services/auth/authApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useUser } from '@/contexts/UserContext';

const PASSWORD_HINT = 'Не менее 6 символов, не менее 2 спецсимволов, не менее одной заглавной буквы';

export default function SignupModal() {
  const router = useRouter();
  const { openSignin, closeModal } = useAuthModal();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; repeatPassword?: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = (): { isValid: boolean; formError: string | null } => {
    const newErrors: { email?: boolean; password?: boolean; repeatPassword?: boolean } = {};
    let isValid = true;

    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = true;
      isValid = false;
    }

    if (!password.trim() || password.length < 6) {
      newErrors.password = true;
      isValid = false;
    }

    if (!repeatPassword.trim() || password !== repeatPassword) {
      newErrors.repeatPassword = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid && password.trim() && repeatPassword.trim() && password !== repeatPassword) {
      return { isValid: false, formError: 'Пароли не совпадают' };
    }
    if (!isValid) {
      return { isValid: false, formError: 'Заполните все поля корректно!' };
    }
    return { isValid: true, formError: null };
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError(null);
    if (errors.email) {
      setErrors({ ...errors, email: false });
    }
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError(null);
    if (errors.password) {
      setErrors({ ...errors, password: false });
    }
    if (errors.repeatPassword && repeatPassword && e.target.value === repeatPassword) {
      setErrors({ ...errors, repeatPassword: false });
    }
  };

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setFormError(null);
    if (errors.repeatPassword) {
      setErrors({ ...errors, repeatPassword: false });
    }
  };

  const onBlurEmail = () => {
    if (email && !validateEmail(email)) {
      setErrors({ ...errors, email: true });
    }
  };

  const onBlurPassword = () => {
    if (validatePassword(password)) {
      setErrors({ ...errors, password: true });
    }
  };

  const onBlurRepeatPassword = () => {
    if (!repeatPassword.trim() || password !== repeatPassword) {
      setErrors({ ...errors, repeatPassword: true });
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateForm();
    if (!validation.isValid) {
      setFormError(validation.formError ?? 'Заполните все поля корректно!');
      return;
    }

    setIsLoading(true);

    regUser({ email, password })
      .then(() => {
        return loginUser({ email, password });
      })
      .then((loginRes) => {
        saveToken(loginRes.token);
        return new Promise((resolve) => setTimeout(resolve, 100)).then(() => refreshUser());
      })
      .then(() => {
        toast.success('Регистрация прошла успешно! Вы авторизованы.');
        closeModal();
        router.push('/main');
      })
      .catch((error) => {
        const message = getAxiosErrorMessage(error, 'Пользователь с таким email уже существует');
        setFormError(message);
        const lower = message.toLowerCase();
        if (lower.includes('email') || lower.includes('почт') || lower.includes('существует')) {
          setErrors({ email: true });
        } else if (lower.includes('пароль') || lower.includes('парол')) {
          setErrors({ password: true });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <button
        onClick={closeModal}
        className={styles.modal__logo}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={220}
          height={35}
          className={styles.logo__image}
        />
      </button>
      <div className={styles.modal__inputs}>
        <input
          className={`${styles.modal__input} ${styles.login} ${errors.email ? styles.modal__input__error : ''}`}
          type="email"
          name="email"
          placeholder="Эл. почта"
          onChange={onChangeEmail}
          onBlur={onBlurEmail}
          value={email}
        />
        <input
          className={`${styles.modal__input} ${errors.password ? styles.modal__input__error : ''}`}
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={onChangePassword}
          onBlur={onBlurPassword}
          value={password}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className={styles.modal__hint}>
          {PASSWORD_HINT}
        </p>
        <input
          className={`${styles.modal__input} ${errors.repeatPassword ? styles.modal__input__error : ''}`}
          type="password"
          name="repeatPassword"
          placeholder="Повторите пароль"
          onChange={onChangeRepeatPassword}
          onBlur={onBlurRepeatPassword}
          value={repeatPassword}
        />
      </div>
      {formError && (
        <p className={styles.modal__error} role="alert">
          {formError}
        </p>
      )}
      <div className={styles.modal__buttons}>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="btn btn-full"
        >
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        <button
          onClick={openSignin}
          className="btn-secondary btn-full"
        >
          Войти
        </button>
      </div>
    </>
  );
}
