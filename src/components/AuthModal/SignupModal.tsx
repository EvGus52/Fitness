'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';
import styles from './signupModal.module.css';

// TODO: Раскомментировать когда будут готовы API
// import { regUser } from '@/services/auth/regApi';
// import { AxiosError } from 'axios';
// import { toast } from 'react-toastify';

export default function SignupModal() {
  const router = useRouter();
  const { openSignin, closeModal } = useAuthModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
      // toast.error('Заполните все поля!');
      console.log('Заполните все поля!');
      return;
    }

    if (password !== repeatPassword) {
      // toast.error('Пароли не совпадают!');
      console.log('Пароли не совпадают!');
      return;
    }

    setIsLoading(true);

    // TODO: Раскомментировать когда будут готовы API
    // regUser({ email, password })
    //   .then((res) => {
    //     toast.success('Поздравляем! Вы успешно зарегистрировались!');
    //     setTimeout(() => {
    //       closeModal();
    //       openSignin();
    //     }, 1000);
    //   })
    //   .catch((error) => {
    //     if (error instanceof AxiosError) {
    //       if (error.response) {
    //         toast.error(
    //           error.response.data.message || 'Ошибка при регистрации',
    //         );
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
      console.log('Signup:', { email, password });
      setIsLoading(false);
      closeModal();
      openSignin();
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
      <input
        className={styles.modal__input}
        type="password"
        name="repeatPassword"
        placeholder="Повторите пароль"
        onChange={onChangeRepeatPassword}
        value={repeatPassword}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={styles.modal__btnSignupEnt}
      >
        {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
      </button>
      <button
        onClick={openSignin}
        className={styles.modal__btnSignin}
      >
        Войти
      </button>
    </>
  );
}
