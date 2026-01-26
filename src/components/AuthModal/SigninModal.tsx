'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './signinModal.module.css';

// TODO: Раскомментировать когда будут готовы API и store
// import { getTokens, loginUser } from '@/services/auth/authApi';
// import { AxiosError } from 'axios';
// import { useAppDispatch } from '@/store/store';
// import {
//   setAccessToken,
//   setRefreshToken,
//   setUsername,
// } from '@/store/features/authSlice';
// import { toast } from 'react-toastify';

export default function SigninModal() {
  const router = useRouter();
  const { openSignup, closeModal } = useAuthModal();
  // const dispatch = useAppDispatch();
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
      // toast.error('Заполните все поля!');
      console.log('Заполните все поля!');
      return;
    }
    setIsLoading(true);

    // TODO: Раскомментировать когда будут готовы API
    // loginUser({ email, password })
    //   .then(() => {
    //     dispatch(setUsername(email));
    //     return getTokens({ email, password });
    //   })
    //   .then((res) => {
    //     dispatch(setAccessToken(res.access));
    //     dispatch(setRefreshToken(res.refresh));
    //     toast.success('Вход выполнен успешно');
    //     closeModal();
    //     router.push('/profile');
    //   })
    //   .catch((error) => {
    //     if (error instanceof AxiosError) {
    //       if (error.response) {
    //         const errorData = error.response.data as { message: string };
    //         toast.error(errorData.message);
    //       } else if (error.request) {
    //         toast.error('Пропал интернет');
    //       } else {
    //         toast.error('Неизвестная ошибка, попробуйте позже');
    //       }
    //     }
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });

    // Временная заглушка
    setTimeout(() => {
      console.log('Login:', { email, password });
      setIsLoading(false);
      closeModal();
      router.push('/profile');
    }, 1000);
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
        type="text"
        name="login"
        placeholder="Логин"
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
        className={styles.modal__btnEnter}
      >
        {isLoading ? 'Загрузка...' : 'Войти'}
      </button>
      <button
        onClick={openSignup}
        className={styles.modal__btnSignup}
      >
        Зарегистрироваться
      </button>
    </>
  );
}
