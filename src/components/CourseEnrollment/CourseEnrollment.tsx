'use client';

import styles from './courseEnrollment.module.css';
import Image from 'next/image';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function CourseEnrollment() {
  const { openSignin } = useAuthModal();

  return (
    <div className={styles.enrollment}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h2 className={styles.title}>Начните путь к новому телу</h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                проработка всех групп мышц
              </li>
              <li className={styles.benefitItem}>тренировка суставов</li>
              <li className={styles.benefitItem}>
                улучшение циркуляции крови
              </li>
              <li className={styles.benefitItem}>
                упражнения заряжают бодростью
              </li>
              <li className={styles.benefitItem}>
                помогают противостоять стрессам
              </li>
            </ul>
            <button onClick={openSignin} className="btn btn-full">
              Войдите, чтобы добавить курс
            </button>
          </div>
          <div className={styles.imageBlock}>
            <div className={styles.lineWrapper}>
              <Image
                src="/line.svg"
                alt=""
                width={400}
                height={600}
                className={styles.line}
              />
            </div>
            <div className={styles.menWrapper}>
              <Image
                src="/men.png"
                alt="Атлет"
                width={500}
                height={700}
                className={styles.men}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
