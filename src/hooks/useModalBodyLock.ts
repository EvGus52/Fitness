import { useEffect } from 'react';

/**
 * Блокирует скролл body при открытой модалке (overflow: hidden) и восстанавливает при закрытии.
 */
export function useModalBodyLock(isOpen: boolean): void {
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
}
