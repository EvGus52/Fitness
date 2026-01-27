'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserMenu } from '@/contexts/UserMenuContext';
import { useConfirmLogout } from '@/contexts/ConfirmLogoutContext';
import styles from './userMenuModal.module.css';

export default function UserMenuModal() {
  const { isOpen, closeMenu } = useUserMenu();
  const router = useRouter();
  const { openConfirm } = useConfirmLogout();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    closeMenu();
  };

  const handleProfileClick = () => {
    closeMenu();
    router.push('/profile');
  };

  const handleLogoutClick = () => {
    closeMenu();
    openConfirm();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <button
            onClick={handleProfileClick}
            className="btn btn-full btn-padding-sm"
          >
            Мой профиль
          </button>
          <button
            onClick={handleLogoutClick}
            className="btn-secondary btn-full btn-padding-sm"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
