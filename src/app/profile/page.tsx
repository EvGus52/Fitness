'use client';

import Header from '@/components/Header/Header';
import UserProfile from '@/components/UserProfile/UserProfile';
import { useConfirmLogout } from '@/contexts/ConfirmLogoutContext';

export default function ProfilePage() {
  const { openConfirm } = useConfirmLogout();

  const handleLogout = () => {
    openConfirm();
  };

  return (
    <>
      <Header />
      <UserProfile onLogout={handleLogout} />
    </>
  );
}
