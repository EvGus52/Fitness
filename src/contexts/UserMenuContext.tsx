'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const UserMenuContext = createContext<UserMenuContextType | undefined>(
  undefined,
);

export function UserMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <UserMenuContext.Provider value={{ isOpen, openMenu, closeMenu }}>
      {children}
    </UserMenuContext.Provider>
  );
}

export function useUserMenu() {
  const context = useContext(UserMenuContext);
  if (context === undefined) {
    throw new Error('useUserMenu must be used within a UserMenuProvider');
  }
  return context;
}
