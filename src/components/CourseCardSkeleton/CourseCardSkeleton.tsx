'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './courseCardSkeleton.module.css';

export default function CourseCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.image} height={325} borderRadius={0} />
      <div className={styles.content}>
        <Skeleton height={32} width="80%" style={{ marginBottom: 20 }} />
        <div className={styles.info}>
          <Skeleton height={40} width={100} borderRadius={50} />
          <Skeleton height={40} width={140} borderRadius={50} />
          <Skeleton height={40} width={90} borderRadius={50} />
        </div>
        <Skeleton height={6} width="100%" borderRadius={50} style={{ marginTop: 20 }} />
        <Skeleton height={44} width="100%" borderRadius={46} style={{ marginTop: 20 }} />
      </div>
    </div>
  );
}
