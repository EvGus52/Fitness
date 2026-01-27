'use client';

import styles from './centerblock.module.css';
import Image from 'next/image';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { Course } from '@/sharedTypes/sharedTypes';

interface CenterblockProps {
  courses: Course[];
  selectedCourses?: string[];
  onCourseAdded?: () => void;
  onCourseRemoved?: () => void;
}

export default function Centerblock({
  courses,
  selectedCourses = [],
  onCourseAdded,
  onCourseRemoved,
}: CenterblockProps) {
  return (
    <div id="centerblock" className={`container ${styles.centerblock}`}>
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
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isAdded={selectedCourses.includes(course.id)}
            onCourseAdded={onCourseAdded}
            onCourseRemoved={onCourseRemoved}
          />
        ))}
      </div>
    </div>
  );
}
