'use client';

import styles from './userProfile.module.css';
import Image from 'next/image';

interface UserProfileProps {
    name?: string;
    login?: string;
    onLogout?: () => void;
}

export default function UserProfile({
    name = 'Сергей',
    login = 'sergey.petrov96',
    onLogout,
}: UserProfileProps) {
    return (
        <div className={styles.profile}>
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        <Image
                            src="/maskUser.png"
                            alt="Аватар пользователя"
                            width={100}
                            height={100}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>{name}</h2>
                        <p className={styles.userLogin}>Логин: {login}</p>
                        <button onClick={onLogout} className={styles.logoutButton}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
