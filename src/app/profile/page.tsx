'use client';

import Header from '@/components/Header/Header';
import UserProfile from '@/components/UserProfile/UserProfile';

export default function ProfilePage() {
    const handleLogout = () => {
        // Здесь будет логика выхода
        console.log('Logout');
    };

    return (
        <>
            <Header />
            <UserProfile onLogout={handleLogout} />
        </>
    );
}
