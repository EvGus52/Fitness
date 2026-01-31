import { useEffect } from 'react';

/**
 * Блокирует скролл body при открытой модалке (overflow: hidden) и восстанавливает при закрытии.
 * Компенсирует ширину полосы прокрутки через padding-right, чтобы экран не прыгал.
 */
export function useModalBodyLock(isOpen: boolean): void {
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
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
}
