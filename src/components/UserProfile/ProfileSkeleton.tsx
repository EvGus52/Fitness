'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './userProfile.module.css';

export default function ProfileSkeleton() {
  return (
    <div className={styles.profileCard}>
      <div className={styles.avatarWrapper}>
        <Skeleton height={197} width={197} borderRadius={20} />
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userInfoBlock}>
          <Skeleton height={32} width={180} style={{ marginBottom: 8 }} />
          <Skeleton height={24} width={240} />
        </div>
        <Skeleton height={48} width={192} borderRadius={46} />
      </div>
    </div>
  );
}
