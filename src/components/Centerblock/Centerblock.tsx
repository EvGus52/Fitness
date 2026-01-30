'use client';

import styles from './centerblock.module.css';
import Image from 'next/image';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import CourseCardSkeleton from '@/components/CourseCardSkeleton/CourseCardSkeleton';
import { Course } from '@/sharedTypes/sharedTypes';

interface CenterblockProps {
  courses: Course[];
  selectedCourses?: string[];
  isLoading?: boolean;
  error?: string | null;
  onCourseAdded?: () => void;
  onCourseRemoved?: () => void;
}

export default function Centerblock({
  courses,
  selectedCourses = [],
  isLoading = false,
  error = null,
  onCourseAdded,
  onCourseRemoved,
}: CenterblockProps) {
  return (
    <div id="centerblock" className={`center ${styles.centerblock}`}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <div className={styles.bubble}>
          <Image
            src="/motivation.png"
            alt="Измени своё тело за полгода!"
            width={288}
            height={120}
            className={styles.bubble__image}
          />
        </div>
      </div>

      <div className={styles.courses__grid}>
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonCardWrapper}>
                <CourseCardSkeleton />
              </div>
            ))}
          </>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              isAdded={selectedCourses.includes(course.id)}
              onCourseAdded={onCourseAdded}
              onCourseRemoved={onCourseRemoved}
              priority={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
