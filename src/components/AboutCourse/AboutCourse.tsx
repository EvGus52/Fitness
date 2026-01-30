'use client';

import styles from './aboutCourse.module.css';
import Image from 'next/image';
import type { CourseForDetailPage } from '@/utils/courseUtils';

interface AboutCourseProps {
  course: CourseForDetailPage;
}

export default function AboutCourse({ course }: AboutCourseProps) {
  return (
    <div className={styles.aboutCourse}>
      {/* Верхняя секция - изображение skill card */}
      <div className={styles.topSection}>
        <div className={`center ${styles.topContainer}`}>
          <Image
            src={course.image || `/skill card 1.png`}
            alt={course.nameRU}
            width={1160}
            height={310}
            className={styles.skillCardImage}
          />
        </div>
      </div>

      {/* Нижняя секция - черный фон */}
      <div className={styles.bottomSection}>
        <div className="center">
          {/* Блок "Подойдет для вас, если:" */}
          {course.suitableFor && course.suitableFor.length > 0 && (
            <div className={styles.suitableFor}>
              <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
              <div className={styles.suitableForList}>
                {course.suitableFor.map((item, index) => (
                  <div key={index} className={styles.suitableForItem}>
                    <span className={styles.itemNumber}>{index + 1}</span>
                    <p className={styles.itemText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Блок "Направления" */}
          {course.directions && course.directions.length > 0 && (
            <div className={styles.directions}>
              <div className={styles.directionsBar}>
                {course.directions.map((direction, index) => (
                  <div key={index} className={styles.directionItem}>
                    <Image
                      src="/icon/star.svg"
                      alt="Пункт"
                      width={26}
                      height={26}
                      className={styles.directionPlus}
                    />
                    <span className={styles.directionText}>{direction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
