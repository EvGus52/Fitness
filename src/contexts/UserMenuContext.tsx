'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type AnchorRect = { top: number; left: number; right: number; bottom: number };

interface UserMenuContextType {
  isOpen: boolean;
  anchorRect: AnchorRect | null;
  openMenu: (rect?: AnchorRect) => void;
  closeMenu: () => void;
}

const UserMenuContext = createContext<UserMenuContextType | undefined>(
  undefined,
);

export function UserMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);

  const openMenu = (rect?: AnchorRect) => {
    setAnchorRect(rect ?? null);
    setIsOpen(true);
  };
  const closeMenu = () => setIsOpen(false);

  return (
    <UserMenuContext.Provider value={{ isOpen, anchorRect, openMenu, closeMenu }}>
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
