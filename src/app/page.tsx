'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import Header from '@/components/Header/Header';
import { mockCourses } from './data';
import styles from './page.module.css';

export default function Home() {
    const handleToggleFavorite = (programId: string) => {
        // Здесь будет логика добавления/удаления из избранного
        console.log('Toggle favorite:', programId);
    };

    const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const header = document.getElementById('header');
        if (header) {
            header.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Header />
            <Centerblock
                courses={mockCourses}
                onToggleFavorite={handleToggleFavorite}
            />
            <div className={styles.scrollButtonWrapper}>
                <a
                    href="#header"
                    onClick={handleScrollToTop}
                    className={styles.scrollButton}
                >
                    Наверх <span className={styles.arrow}>↑</span>
                </a>
            </div>
        </>
    );
}
