
'use client';

import Link from 'next/link';
import styles from './courseCard.module.css';
import Image from 'next/image';
import { Course } from '@/components/Centerblock/Centerblock';

interface CourseCardProps {
    course: Course;
    onToggleFavorite?: (courseId: string) => void;
}

export function CourseCard({ course, onToggleFavorite }: CourseCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(course.id);
        }
    };

    return (
        <Link href={`/courses?id=${course.id}`} className={styles.card}>
            <div className={styles.card__image__wrapper}>
                <Image
                    src={course.image}
                    alt={course.nameRU}
                    fill
                    className={styles.card__image}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <button
                    className={styles.card__favorite}
                    onClick={handleFavoriteClick}
                    aria-label="Добавить в избранное"
                >
                    <span className={styles.card__plus}>+</span>
                </button>
            </div>
            <div className={styles.card__content}>
                <h3 className={styles.card__title}>{course.nameRU}</h3>
                <div className={styles.card__info}>
                    <span className={styles.card__duration}>
                        {course.durationInDays} дней
                    </span>
                    <span className={styles.card__time}>
                        {course.dailyDurationInMinutes.from}-
                        {course.dailyDurationInMinutes.to} мин/день
                    </span>
                    <div className={styles.card__difficulty}>
                        <div className={styles.difficulty__indicator}>
                            <div className={styles.difficulty__bars}>
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.difficulty__bar} ${
                                            i < course.difficulty
                                                ? styles.difficulty__bar__active
                                                : ''
                                        }`}
                                        style={{
                                            height: `${(i + 1) * 20}%`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className={styles.difficulty__label}>Сложность</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
