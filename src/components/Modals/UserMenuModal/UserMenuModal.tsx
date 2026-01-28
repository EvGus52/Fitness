'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserMenu } from '@/contexts/UserMenuContext';
import { useConfirmLogout } from '@/contexts/ConfirmLogoutContext';
import { useUser } from '@/contexts/UserContext';
import styles from './userMenuModal.module.css';

const MODAL_WIDTH = 266;
const GAP = 50;

export default function UserMenuModal() {
  const { isOpen, closeMenu, anchorRect } = useUserMenu();
  const router = useRouter();
  const { openConfirm } = useConfirmLogout();
  const { user } = useUser();

  const userName = user?.email ? user.email.split('@')[0] : '';
  const userEmail = user?.email || '';

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  const handleProfileClick = () => {
    closeMenu();
    router.push('/profile');
  };

  const handleLogoutClick = () => {
    closeMenu();
    openConfirm();
  };

  const blockStyle =
    anchorRect != null
      ? {
        position: 'fixed' as const,
        top: anchorRect.bottom + GAP,
        left: anchorRect.right - MODAL_WIDTH,
        zIndex: 1001,
      }
      : undefined;

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div
        className={styles.modal__block}
        style={blockStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal__content}>
          <div className={styles.modal__userInfo}>
            {userName && (
              <h2 className={styles.modal__name}>{userName}</h2>
            )}
            {userEmail && (
              <p className={styles.modal__email}>{userEmail}</p>
            )}
          </div>
          <div className={styles.modal__buttons}>
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
    </div>
  );
}
