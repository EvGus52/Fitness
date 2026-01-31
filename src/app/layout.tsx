import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import AuthModalProviderWrapper from '@/components/Modals/AuthModal/AuthModalProvider';
import ToastProvider from '@/components/ToastProvider/ToastProvider';
import { UserProvider } from '@/contexts/UserContext';
import UserMenuProviderWrapper from '@/components/Modals/UserMenuModal/UserMenuProvider';
import ConfirmLogoutProviderWrapper from '@/components/Modals/ConfirmLogoutModal/ConfirmLogoutProvider';
import SelectWorkoutProviderWrapper from '@/components/Modals/SelectWorkoutModal/SelectWorkoutProvider';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SkyFitnessPro',
  description: 'Change your body for the better',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <UserProvider>
          <ConfirmLogoutProviderWrapper>
            <SelectWorkoutProviderWrapper>
              <UserMenuProviderWrapper>
                <AuthModalProviderWrapper>
                  <ToastProvider>{children}</ToastProvider>
                </AuthModalProviderWrapper>
              </UserMenuProviderWrapper>
            </SelectWorkoutProviderWrapper>
          </ConfirmLogoutProviderWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
