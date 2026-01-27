'use client';

import styles from './aboutCourse.module.css';
import Image from 'next/image';
import { Course } from '@/sharedTypes/sharedTypes';

interface AboutCourseProps {
  course: Course & {
    suitableFor?: string[]; // "Подойдет для вас, если:"
    directions?: string[]; // "Направления"
  };
}

export default function AboutCourse({ course }: AboutCourseProps) {
  return (
    <div className={styles.aboutCourse}>
      {/* Верхняя секция - изображение skill card */}
      <div className={styles.topSection}>
        <div className={`container ${styles.topContainer}`}>
          <Image
            src={course.image || `/skill card 1.png`}
            alt={course.nameRU}
            width={1200}
            height={600}
            className={styles.skillCardImage}
          />
        </div>
      </div>

      {/* Нижняя секция - черный фон */}
      <div className={styles.bottomSection}>
        <div className="container">
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
                    <span className={styles.directionPlus}>+</span>
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
