'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './signinModal.module.css';

import { loginUser, saveToken } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';

export default function SigninModal() {
  const router = useRouter();
  const { openSignup, closeModal } = useAuthModal();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Заполните все поля!');
      return;
    }
    setIsLoading(true);

    loginUser({ email, password })
      .then((res) => {
        saveToken(res.token);
        // Небольшая задержка для гарантии сохранения токена
        return new Promise((resolve) => setTimeout(resolve, 100)).then(() => refreshUser());
      })
      .then(() => {
        toast.success('Вход выполнен успешно');
        closeModal();
        router.push('/main');
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            const errorData = error.response.data as { message: string };
            toast.error(errorData.message || 'Ошибка при входе');
          } else if (error.request) {
            toast.error('Пропал интернет');
          } else {
            toast.error('Неизвестная ошибка, попробуйте позже');
          }
        } else {
          toast.error('Ошибка при входе');
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
      <input
        className={`${styles.modal__input} ${styles.login}`}
        type="email"
        name="email"
        placeholder="Эл. почта"
        onChange={onChangeEmail}
        value={email}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={onChangePassword}
        value={password}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="btn btn-full btn-padding-sm btn-mb-20"
      >
        {isLoading ? 'Загрузка...' : 'Войти'}
      </button>
      <button
        onClick={openSignup}
        className="btn-secondary btn-full btn-padding-sm"
      >
        Зарегистрироваться
      </button>
    </>
  );
}
