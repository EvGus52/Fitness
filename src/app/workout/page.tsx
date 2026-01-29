'use client';

import { Suspense, useEffect, useState } from 'react';
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
import { AxiosError } from 'axios';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';
import { Workout, WorkoutProgress } from '@/sharedTypes/sharedTypes';
import styles from './page.module.css';

function WorkoutContent() {
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
      .catch(() => {
        setError('Не удалось загрузить данные');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, workoutId, hasParams]);

  if (!hasParams) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <p>Не указан курс или тренировка</p>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <p>Загрузка...</p>
        </div>
      </>
    );
  }

  if (error || !course || !workout) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <p>{error ?? 'Тренировка не найдена'}</p>
        </div>
      </>
    );
  }

  const cId = courseId as string;
  const wId = workoutId as string;
  const workoutOrder =
    course.workouts.indexOf(wId) >= 0
      ? course.workouts.indexOf(wId) + 1
      : workout.name;

  const handleFillProgress = () => {
    setIsProgressModalOpen(true);
  };

  const handleProgressSaved = () => {
    getWorkoutProgress(cId, wId)
      .then(setWorkoutProgress)
      .catch(() => { });
  };

  const handleResetProgress = async () => {
    try {
      await resetWorkoutProgress(cId, wId);
      const freshProgress = await getWorkoutProgress(cId, wId).catch(() => null);
      setWorkoutProgress(freshProgress);
      toast.success('Прогресс тренировки сброшен');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        toast.error(data.message ?? 'Ошибка при сбросе прогресса');
      } else {
        toast.error('Ошибка при сбросе прогресса');
      }
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>{course.nameRU}</h1>
        <section className={styles.videoSection}>
          <WorkoutVideo videoUrl={workout.video} title={workout.name} />
        </section>
        <section className={styles.exercisesSection}>
          <WorkoutExercises
            workoutTitle={String(workoutOrder)}
            exercises={workout.exercises ?? []}
            progress={workoutProgress}
            onFillProgress={handleFillProgress}
            onResetProgress={handleResetProgress}
          />
        </section>
        <Link href="/profile" className={`btn ${styles.backToProfile}`}>
          <span className={styles.backToProfile__arrow}>←</span> В профиль
        </Link>
      </div>
      <ProgressModal
        isOpen={isProgressModalOpen}
        courseId={cId}
        workoutId={wId}
        exercises={workout.exercises ?? []}
        initialProgressData={workoutProgress?.progressData ?? []}
        onSave={handleProgressSaved}
        onClose={() => setIsProgressModalOpen(false)}
        onSaveSuccess={() => {
          setIsProgressModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
      <SuccessConfirmModal
        isOpen={isSuccessModalOpen}
        message="Прогресс сохранён"
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className={styles.page}><p>Загрузка...</p></div>
      </>
    }>
      <WorkoutContent />
    </Suspense>
  );
}
