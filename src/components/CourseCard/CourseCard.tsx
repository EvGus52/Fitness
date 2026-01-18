'use client';

import styles from './courseCard.module.css';
import Image from 'next/image';
import { Course } from '@/components/Centerblock/Centerblock';

interface CourseCardProps {
    course: Course;
    onToggleFavorite?: (courseId: string) => void;
}

export function CourseCard({ course, onToggleFavorite }: CourseCardProps) {
    const handleClick = () => {
        if (onToggleFavorite) {
            onToggleFavorite(course.id);
        }
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.card__image__wrapper}>
                <Image
                    src={course.image}
                    alt={course.nameRU}
                    fill
                    className={styles.card__image}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <button className={styles.card__favorite} aria-label="Добавить в избранное">
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
                        <span className={styles.card__difficulty__label}>Сложность</span>
                        <div className={styles.card__difficulty__bar}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.difficulty__item} ${i < course.difficulty ? styles.difficulty__item__active : ''
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
