'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalType = 'signin' | 'signup' | null;

interface AuthModalContextType {
  modalType: AuthModalType;
  openSignin: () => void;
  openSignup: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<AuthModalType>(null);

  const openSignin = () => setModalType('signin');
  const openSignup = () => setModalType('signup');
  const closeModal = () => setModalType(null);

  return (
    <AuthModalContext.Provider
      value={{ modalType, openSignin, openSignup, closeModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
