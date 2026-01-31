'use client';

import { ConfirmLogoutProvider } from '@/contexts/ConfirmLogoutContext';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import { ReactNode } from 'react';

export default function ConfirmLogoutProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConfirmLogoutProvider>
      {children}
      <ConfirmLogoutModal />
    </ConfirmLogoutProvider>
  );
}
