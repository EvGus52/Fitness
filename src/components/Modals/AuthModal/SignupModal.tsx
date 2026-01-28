'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './signupModal.module.css';

import { regUser } from '@/services/auth/regApi';
import { loginUser, saveToken } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';

export default function SignupModal() {
  const router = useRouter();
  const { openSignin, closeModal } = useAuthModal();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; repeatPassword?: boolean }>({});

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = (): boolean => {
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
    return isValid;
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: false });
    }
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: false });
    }
    if (errors.repeatPassword && repeatPassword && e.target.value === repeatPassword) {
      setErrors({ ...errors, repeatPassword: false });
    }
  };

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
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
    if (!password.trim() || password.length < 6) {
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

    if (!validateForm()) {
      toast.error('Заполните все поля корректно!');
      return;
    }

    setIsLoading(true);

    regUser({ email, password })
      .then(() => {
        // После успешной регистрации автоматически авторизуем пользователя
        return loginUser({ email, password });
      })
      .then((loginRes) => {
        saveToken(loginRes.token);
        // Небольшая задержка для гарантии сохранения токена
        return new Promise((resolve) => setTimeout(resolve, 100)).then(() => refreshUser());
      })
      .then(() => {
        toast.success('Регистрация прошла успешно! Вы авторизованы.');
        closeModal();
        router.push('/main');
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            const errorData = error.response.data as { message: string };
            toast.error(errorData.message || 'Ошибка при регистрации');
          } else if (error.request) {
            toast.error('Пропал интернет');
          } else {
            toast.error('Неизвестная ошибка, попробуйте позже');
          }
        } else {
          toast.error('Ошибка при регистрации');
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
        />
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
      <div className={styles.modal__buttons}>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="btn btn-full btn-padding-sm"
        >
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        <button
          onClick={openSignin}
          className="btn-secondary btn-full btn-padding-sm"
        >
          Войти
        </button>
      </div>
    </>
  );
}
