'use client';

import { useEffect, useState } from 'react';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelectWorkout } from '@/contexts/SelectWorkoutContext';
import { getCourseWorkouts } from '@/services/courses/coursesApi';
import { getCourseProgress } from '@/services/progress/progressApi';
import { Workout } from '@/sharedTypes/sharedTypes';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { toast } from 'react-toastify';
import styles from './selectWorkoutModal.module.css';

interface SelectWorkoutListProps {
  courseId: string;
  onStart: (workoutId: string) => void;
}

function SelectWorkoutList({ courseId, onStart }: SelectWorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<Set<string>>(new Set());
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getCourseWorkouts(courseId),
      getCourseProgress(courseId).catch(() => null),
    ])
      .then(([workoutsData, progress]) => {
        if (cancelled) return;
        setWorkouts(workoutsData);
        setSelectedWorkoutId(workoutsData.length > 0 ? workoutsData[0]._id : null);
        if (progress?.workoutsProgress) {
          const completed = new Set(
            progress.workoutsProgress
              .filter((wp) => wp.workoutCompleted)
              .map((wp) => wp.workoutId)
          );
          setCompletedWorkoutIds(completed);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setWorkouts([]);
          toast.error(getAxiosErrorMessage(err, 'Не удалось загрузить список тренировок'));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const handleStart = () => {
    if (selectedWorkoutId) onStart(selectedWorkoutId);
  };

  if (isLoading) {
    return <p>Загрузка тренировок...</p>;
  }
  if (workouts.length === 0) {
    return <p>Нет доступных тренировок</p>;
  }

  return (
    <>
      <div className={styles.workoutList}>
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className={`${styles.workoutItem} ${selectedWorkoutId === workout._id ? styles.selected : ''}`}
            onClick={() => setSelectedWorkoutId(workout._id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedWorkoutId(workout._id);
              }
            }}
          >
            <div className={styles.workoutItem__marker}>
              {completedWorkoutIds.has(workout._id) ? (
                <Image
                  src="/icon/ok.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.workoutItem__okIcon}
                />
              ) : (
                <div
                  className={`${styles.workoutItem__radio} ${selectedWorkoutId === workout._id ? styles.selected : ''}`}
                />
              )}
            </div>
            <div className={styles.workoutItem__text}>
              <p className={styles.workoutItem__title}>{workout.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.modal__startBtn}>
        <button
          type="button"
          onClick={handleStart}
          disabled={!selectedWorkoutId}
          className="btn btn-full btn-padding-sm"
        >
          Начать
        </button>
      </div>
    </>
  );
}

export default function SelectWorkoutModal() {
  const { isOpen, courseId, closeModal } = useSelectWorkout();
  const router = useRouter();

  useModalBodyLock(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleStart = (workoutId: string) => {
    if (courseId) {
      closeModal();
      router.push(`/workout?courseId=${courseId}&workoutId=${workoutId}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modal__title}>Выберите тренировку</h2>
        <div className={styles.modal__content}>
          {courseId && (
            <SelectWorkoutList
              key={courseId}
              courseId={courseId}
              onStart={handleStart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
