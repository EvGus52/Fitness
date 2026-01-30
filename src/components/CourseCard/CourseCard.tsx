'use client';

import Link from 'next/link';
import styles from './courseCard.module.css';
import Image from 'next/image';
import { Course } from '@/sharedTypes/sharedTypes';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { addUserCourse, deleteUserCourse } from '@/services/userCourses/userCoursesApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';

interface CourseCardProps {
    course: Course;
    isAdded?: boolean;
    onCourseAdded?: () => void;
    onCourseRemoved?: () => void;
    /** Для первой карточки на главной — улучшает LCP (loading="eager") */
    priority?: boolean;
}

export function CourseCard({
    course,
    isAdded = false,
    onCourseAdded,
    onCourseRemoved,
    priority = false,
}: CourseCardProps) {
    const { user } = useUser();
    const { openSignin } = useAuthModal();

    const handleAddClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            openSignin();
            return;
        }

        if (isAdded) {
            // Удаление курса
            try {
                await deleteUserCourse(course.id);
                toast.success('Курс успешно удален!');
                if (onCourseRemoved) {
                    onCourseRemoved();
                }
            } catch (error) {
                toast.error(getAxiosErrorMessage(error, 'Ошибка при удалении курса'));
            }
        } else {
            // Добавление курса
            try {
                await addUserCourse(course.id);
                toast.success('Курс успешно добавлен!');
                if (onCourseAdded) {
                    onCourseAdded();
                }
            } catch (error) {
                toast.error(getAxiosErrorMessage(error, 'Ошибка при добавлении курса'));
            }
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
                    priority={priority}
                />
                <button
                    className={styles.card__favorite}
                    onClick={handleAddClick}
                    aria-label={isAdded ? 'Удалить курс' : 'Добавить курс'}
                >
                    <Image
                        src={isAdded ? '/icon/min.svg' : '/icon/plus.svg'}
                        alt={isAdded ? 'Удалить курс' : 'Добавить курс'}
                        width={27}
                        height={27}
                        className={styles.card__icon}
                    />
                </button>
            </div>
            <div className={styles.card__content}>
                <h3 className={styles.card__title}>{course.nameRU}</h3>
                <div className={styles.card__info}>
                    <div className={styles.card__duration}>
                        <Image
                            src="/icon/days.svg"
                            alt="Дни"
                            width={16}
                            height={16}
                            className={styles.card__duration__icon}
                        />
                        <span>{course.durationInDays} дней</span>
                    </div>
                    <div className={styles.card__time}>
                        <Image
                            src="/icon/time.svg"
                            alt="Время"
                            width={16}
                            height={16}
                            className={styles.card__time__icon}
                        />
                        <span>
                            {course.dailyDurationInMinutes.from}-
                            {course.dailyDurationInMinutes.to} мин/день
                        </span>
                    </div>
                    <div className={styles.card__difficulty}>
                        <div className={styles.difficulty__indicator}>
                            <div className={styles.difficulty__bars}>
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.difficulty__bar} ${i < course.difficulty
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
