'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './authModal.module.css';

import { loginUser, saveToken } from '@/services/auth/authApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { validateEmail } from '@/utils/validation';
import { useUser } from '@/contexts/UserContext';

export default function SigninModal() {
  const router = useRouter();
  const { openSignup, closeModal } = useAuthModal();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { email?: boolean; password?: boolean } = {};
    let isValid = true;

    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = true;
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
  };

  const onBlurEmail = () => {
    if (email && !validateEmail(email)) {
      setErrors({ ...errors, email: true });
    }
  };

  const onBlurPassword = () => {
    if (!password.trim()) {
      setErrors({ ...errors, password: true });
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      setFormError('Заполните все поля корректно!');
      return;
    }
    setIsLoading(true);

    loginUser({ email, password })
      .then((res) => {
        saveToken(res.token);
        return new Promise((resolve) => setTimeout(resolve, 100)).then(() => refreshUser());
      })
      .then(() => {
        toast.success('Вход выполнен успешно');
        closeModal();
        router.push('/main');
      })
      .catch((error) => {
        const message = getAxiosErrorMessage(error, 'Пароль введен неверно, попробуйте еще раз.');
        setFormError(message);
        if (error instanceof AxiosError && error.response?.status === 401) {
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
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
        <button
          onClick={openSignup}
          className="btn-secondary btn-full"
        >
          Зарегистрироваться
        </button>
      </div>
    </>
  );
}
