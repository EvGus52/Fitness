'use client';

import { useEffect } from 'react';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import Image from 'next/image';
import styles from './successConfirmModal.module.css';

interface SuccessConfirmModalProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
}

const AUTO_CLOSE_MS = 3000;

export default function SuccessConfirmModal({
  isOpen,
  message = 'Ваш прогресс засчитан!',
  onClose,
}: SuccessConfirmModalProps) {
  useModalBodyLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <p className={styles.modal__message}>{message}</p>
          <Image
            src="/icon/ok.svg"
            alt=""
            width={56}
            height={56}
            className={styles.modal__icon}
          />
        </div>
      </div>
    </div>
  );
}
