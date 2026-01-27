'use client';

import Link from 'next/link';
import Header from '@/components/Header/Header';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.message}>Страница не найдена</p>
          <p className={styles.description}>
            К сожалению, запрашиваемая страница не существует или была удалена.
          </p>
          <Link href="/main" className="btn">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
}
