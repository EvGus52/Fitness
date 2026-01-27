'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, getCurrentUser } from '@/services/users/usersApi';
import { getToken } from '@/services/auth/authApi';

type UserContextType = {
  user: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
