'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import WorkoutVideo from '@/components/WorkoutVideo/WorkoutVideo';
import WorkoutExercises from '@/components/WorkoutExercises/WorkoutExercises';
import ProgressModal from '@/components/Modals/ProgressModal/ProgressModal';
import SuccessConfirmModal from '@/components/Modals/SuccessConfirmModal/SuccessConfirmModal';
import { getCourseById } from '@/services/courses/coursesApi';
import { getWorkoutById, resetWorkoutProgress } from '@/services/workouts/workoutsApi';
import { getWorkoutProgress } from '@/services/progress/progressApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';
import { CourseFromAPI, Workout, WorkoutProgress } from '@/sharedTypes/sharedTypes';
import styles from './workoutPageContent.module.css';

export default function WorkoutPageContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const workoutId = searchParams.get('workoutId');

  const [course, setCourse] = useState<CourseFromAPI | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const hasParams = Boolean(courseId && workoutId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasParams) return;

    Promise.all([
      getCourseById(courseId!),
      getWorkoutById(workoutId!),
      getWorkoutProgress(courseId!, workoutId!).catch(() => null),
    ])
      .then(([courseData, workoutData, progressData]) => {
        setCourse(courseData);
        setWorkout(workoutData);
        setWorkoutProgress(progressData ?? null);
      })
      .catch((err) => {
        setError(getAxiosErrorMessage(err, 'Не удалось загрузить данные'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [hasParams, courseId, workoutId]);

  const refreshProgress = () => {
    if (!courseId || !workoutId) return;
    getWorkoutProgress(courseId, workoutId)
      .then(setWorkoutProgress)
      .catch(() => setWorkoutProgress(null));
  };

  const handleResetProgress = () => {
    if (!courseId || !workoutId) return;
    resetWorkoutProgress(courseId, workoutId)
      .then(() => {
        refreshProgress();
        toast.success('Прогресс сброшен');
      })
      .catch((err) => {
        toast.error(getAxiosErrorMessage(err, 'Ошибка при сбросе прогресса'));
      });
  };

  if (!hasParams) {
    return (
      <>
        <Header />
        <div className={`center ${styles.page}`}>
          <p>Укажите курс и тренировку в адресе</p>
        </div>
      </>
    );
  }

  if (isLoading || error) {
    return (
      <>
        <Header />
        <div className={`center ${styles.page}`}>
          {isLoading ? <p>Загрузка...</p> : <p>{error}</p>}
        </div>
      </>
    );
  }

  if (!workout) {
    return (
      <>
        <Header />
        <div className={`center ${styles.page}`}>
          <p>Тренировка не найдена</p>
        </div>
      </>
    );
  }

  const initialProgressData = workoutProgress?.progressData ?? [];

  return (
    <>
      <Header />
      <div className={`center ${styles.page}`}>
        <h1 className={styles.title}>{course?.nameRU ?? workout.name}</h1>

        <section className={styles.videoSection}>
          <WorkoutVideo videoUrl={workout.video} title={workout.name} />
        </section>

        <section className={styles.exercisesSection}>
          <WorkoutExercises
            workoutTitle={workout.name}
            exercises={workout.exercises ?? []}
            progress={workoutProgress}
            onFillProgress={() => setIsProgressModalOpen(true)}
            onResetProgress={handleResetProgress}
          />
        </section>

        <div className={styles.backToProfileWrapper}>
          <Link href="/profile" className={`btn ${styles.backToProfile}`}>
            <span className={styles.backToProfile__arrow}>←</span> В профиль
          </Link>
        </div>

        <ProgressModal
          isOpen={isProgressModalOpen}
          courseId={courseId!}
          workoutId={workoutId!}
          exercises={workout.exercises ?? []}
          initialProgressData={initialProgressData}
          onSave={refreshProgress}
          onClose={() => setIsProgressModalOpen(false)}
          onSaveSuccess={() => setIsSuccessModalOpen(true)}
        />

        <SuccessConfirmModal
          isOpen={isSuccessModalOpen}
          message="Прогресс сохранён"
          onClose={() => setIsSuccessModalOpen(false)}
        />
      </div>
    </>
  );
}
