'use client';

import { AuthModalProvider } from '@/contexts/AuthModalContext';
import AuthModal from './AuthModal';
import { ReactNode } from 'react';

export default function AuthModalProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthModalProvider>
      {children}
      <AuthModal />
    </AuthModalProvider>
  );
}
