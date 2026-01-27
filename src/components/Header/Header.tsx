'use client';

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

  // Извлекаем имя из email (часть до @)
  const userName = user?.email ? user.email.split('@')[0] : '';

  const handleCheckmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openMenu();
  };

  return (
    <header id="header" className={styles.header}>
      <div className={`container ${styles.container}`}>
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
              <div className={styles.user__info}>
                <Image
                  src="/icon/iconUser.svg"
                  alt="User icon"
                  width={42}
                  height={42}
                  className={styles.user__icon}
                />
                <span className={styles.user__name}>{userName}</span>
                <button
                  onClick={handleCheckmarkClick}
                  className={styles.user__checkmark__button}
                >
                  <Image
                    src="/icon/checkmark.svg"
                    alt="Checkmark"
                    width={8}
                    height={8}
                    className={styles.user__checkmark}
                  />
                </button>
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
