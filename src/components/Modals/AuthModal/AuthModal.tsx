'use client';

import { useAuthModal } from '@/contexts/AuthModalContext';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import SigninModal from './SigninModal';
import SignupModal from './SignupModal';
import styles from './authModal.module.css';

export default function AuthModal() {
  const { modalType, closeModal } = useAuthModal();

  useModalBodyLock(!!modalType);

  if (!modalType) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__form}>
          {modalType === 'signin' && <SigninModal />}
          {modalType === 'signup' && <SignupModal />}
        </div>
      </div>
    </div>
  );
}
