'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './courseCardSkeleton.module.css';

export default function CourseCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Skeleton className={styles.skeletonImage} borderRadius={0} />
      </div>
      <div className={styles.content}>
        <Skeleton className={styles.skeletonTitle} />
        <div className={styles.info}>
          <Skeleton className={`${styles.skeletonPill} ${styles.skeletonPill_width_100}`} />
          <Skeleton className={`${styles.skeletonPill} ${styles.skeletonPill_width_140}`} />
          <Skeleton className={`${styles.skeletonPill} ${styles.skeletonPill_width_90}`} />
        </div>
        <Skeleton className={styles.skeletonBar} />
        <Skeleton className={styles.skeletonButton} />
      </div>
    </div>
  );
}
