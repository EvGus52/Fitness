'use client';

import { useEffect } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import SigninModal from './SigninModal';
import SignupModal from './SignupModal';
import styles from './authModal.module.css';

export default function AuthModal() {
  const { modalType, closeModal } = useAuthModal();

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalType]);

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
