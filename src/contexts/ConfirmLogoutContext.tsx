'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmLogoutContextType {
  isOpen: boolean;
  openConfirm: () => void;
  closeConfirm: () => void;
}

const ConfirmLogoutContext = createContext<ConfirmLogoutContextType | undefined>(
  undefined,
);

export function ConfirmLogoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openConfirm = () => setIsOpen(true);
  const closeConfirm = () => setIsOpen(false);

  return (
    <ConfirmLogoutContext.Provider value={{ isOpen, openConfirm, closeConfirm }}>
      {children}
    </ConfirmLogoutContext.Provider>
  );
}

export function useConfirmLogout() {
  const context = useContext(ConfirmLogoutContext);
  if (context === undefined) {
    throw new Error('useConfirmLogout must be used within a ConfirmLogoutProvider');
  }
  return context;
}
