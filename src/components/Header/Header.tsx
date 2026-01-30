'use client';

import { useRef } from 'react';
import styles from './header.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useUser } from '@/contexts/UserContext';
import { useUserMenu } from '@/contexts/UserMenuContext';

export default function Header() {
  const { openSignin } = useAuthModal();
  const { user, isLoading } = useUser();
  const { openMenu } = useUserMenu();
  const userInfoRef = useRef<HTMLDivElement>(null);

  // Извлекаем имя из email (часть до @)
  const userName = user?.email ? user.email.split('@')[0] : '';

  const handleUserInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = userInfoRef.current?.getBoundingClientRect();
    openMenu(rect ? { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom } : undefined);
  };

  return (
    <header id="header" className={styles.header}>
      <div className={`center ${styles.container}`}>
        <div className={styles.logo__wrapper}>
          <Link href="/" className={styles.logo}>
            <Image
              width={220}
              height={35}
              className={styles.logo__image}
              src="/logo.svg"
              alt="SkyFitnessPro logo"
              priority
            />
          </Link>
          <p className={styles.tagline}>Онлайн-тренировки для занятий дома</p>
        </div>
        {!isLoading && (
          <>
            {user ? (
              <div
                ref={userInfoRef}
                role="button"
                tabIndex={0}
                onClick={handleUserInfoClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUserInfoClick(e as unknown as React.MouseEvent);
                  }
                }}
                className={styles.user__info}
                aria-label="Открыть меню пользователя"
              >
                <Image
                  src="/icon/iconUser.svg"
                  alt=""
                  width={42}
                  height={42}
                  className={styles.user__icon}
                />
                <span className={styles.user__name}>{userName}</span>
                <span className={styles.user__checkmark__button} aria-hidden>
                  <Image
                    src="/icon/checkmark.svg"
                    alt=""
                    width={8}
                    height={8}
                    className={styles.user__checkmark}
                  />
                </span>
              </div>
            ) : (
              <button onClick={openSignin} className="btn">
                Войти
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
