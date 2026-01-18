'use client';

import styles from './centerblock.module.css';
import Image from 'next/image';
import { CourseCard } from '@/components/CourseCard/CourseCard';

// Тип данных программы из API
export interface Course {
  id: string;
  nameRU: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  difficulty: number; // например, 1-5
  image: string; // путь к изображению
}

interface CenterblockProps {
  courses: Course[];
  onToggleFavorite?: (courseId: string) => void;
}

export default function Centerblock({
  courses,
  onToggleFavorite,
}: CenterblockProps) {
  return (
    <div id="centerblock" className={styles.centerblock}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>
          <span>Начните заниматься спортом</span>
          <span>и улучшите качество жизни</span>
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
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
