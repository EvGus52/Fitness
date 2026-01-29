'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './successConfirmModal.module.css';

interface SuccessConfirmModalProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
}

export default function SuccessConfirmModal({
  isOpen,
  message = 'Прогресс сохранён',
  onClose,
}: SuccessConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <Image
            src="/icon/ok.svg"
            alt=""
            width={56}
            height={56}
            className={styles.modal__icon}
          />
          <p className={styles.modal__message}>{message}</p>
          <div className={styles.modal__btn}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-full btn-padding-sm"
            >
              Ок
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
