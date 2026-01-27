'use client';

import { UserMenuProvider } from '@/contexts/UserMenuContext';
import UserMenuModal from './UserMenuModal';
import { ReactNode } from 'react';

export default function UserMenuProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <UserMenuProvider>
      {children}
      <UserMenuModal />
    </UserMenuProvider>
  );
}
