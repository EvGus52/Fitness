'use client';

import styles from './userCourseCard.module.css';
import Image from 'next/image';
import { Course } from '@/sharedTypes/sharedTypes';
import { deleteUserCourse } from '@/services/userCourses/userCoursesApi';
import { resetCourseProgress } from '@/services/courses/coursesApi';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface UserCourseCardProps {
  course: Course;
  progress?: number; // 0-100
  onCourseRemoved?: () => void;
  onProgressUpdated?: () => void;
}

export default function UserCourseCard({
  course,
  progress = 0,
  onCourseRemoved,
  onProgressUpdated,
}: UserCourseCardProps) {
  const router = useRouter();

  const handleRemoveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await deleteUserCourse(course.id);
      toast.success('Курс успешно удален!');
      if (onCourseRemoved) {
        onCourseRemoved();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as { message: string };
          toast.error(errorData.message || 'Ошибка при удалении курса');
        } else {
          toast.error('Ошибка при удалении курса');
        }
      }
    }
  };

  const handleActionClick = async () => {
    if (progress === 100) {
      // Начать заново - сбросить прогресс
      try {
        await resetCourseProgress(course.id);
        toast.success('Прогресс курса сброшен!');
        if (onProgressUpdated) {
          onProgressUpdated();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            const errorData = error.response.data as { message: string };
            toast.error(errorData.message || 'Ошибка при сбросе прогресса');
          } else {
            toast.error('Ошибка при сбросе прогресса');
          }
        }
      }
    } else {
      // Начать тренировки или продолжить - переход на страницу курса
      router.push(`/courses?id=${course.id}`);
    }
  };

  const getButtonText = () => {
    if (progress === 0) return 'Начать тренировки';
    if (progress === 100) return 'Начать заново';
    return 'Продолжить';
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__image__wrapper}>
        <Image
          src={course.image}
          alt={course.nameRU}
          fill
          className={styles.card__image}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <button
          className={styles.card__remove}
          onClick={handleRemoveClick}
          aria-label="Удалить курс"
        >
          <Image
            src="/icon/min.svg"
            alt="Удалить курс"
            width={24}
            height={24}
            className={styles.card__icon}
          />
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
          <div className={styles.card__progress}>
            <span className={styles.progress__label}>Прогресс {progress}%</span>
            <div className={styles.progress__bar}>
              <div
                className={styles.progress__fill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={handleActionClick}
            className="btn btn-full btn-padding-sm btn-mt-10"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
