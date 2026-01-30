'use client';

import { useRouter } from 'next/navigation';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import { useConfirmLogout } from '@/contexts/ConfirmLogoutContext';
import { removeToken } from '@/services/auth/authApi';
import { useUser } from '@/contexts/UserContext';
import styles from './confirmLogoutModal.module.css';

export default function ConfirmLogoutModal() {
  const { isOpen, closeConfirm } = useConfirmLogout();
  const router = useRouter();
  const { clearUser } = useUser();

  useModalBodyLock(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    closeConfirm();
  };

  const handleYesClick = () => {
    removeToken();
    clearUser();
    closeConfirm();
    router.push('/main');
  };

  const handleNoClick = () => {
    closeConfirm();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <p className={styles.message}>Вы точно хотите выйти из профиля?</p>
          <div className={styles.buttons}>
            <button onClick={handleYesClick} className="btn btn-full btn-padding-sm">
              Да
            </button>
            <button onClick={handleNoClick} className="btn-secondary btn-full btn-padding-sm">
              Нет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
