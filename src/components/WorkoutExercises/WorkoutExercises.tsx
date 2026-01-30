'use client';

import { Exercise, WorkoutProgress } from '@/sharedTypes/sharedTypes';
import { getExerciseProgressPercent } from '@/utils/workoutUtils';
import styles from './workoutExercises.module.css';

interface WorkoutExercisesProps {
  workoutTitle: string;
  exercises: Exercise[];
  progress: WorkoutProgress | null;
  onFillProgress: () => void;
  onResetProgress?: () => void;
}

export default function WorkoutExercises({
  workoutTitle,
  exercises = [],
  progress,
  onFillProgress,
  onResetProgress,
}: WorkoutExercisesProps) {
  const progressData = progress?.progressData ?? [];
  const list = Array.isArray(exercises) ? exercises : [];
  const hasAnyProgress = progressData.some((value) => typeof value === 'number' && value > 0);
  const isWorkoutCompleted = Boolean(progress?.workoutCompleted);
  const showResetButton = isWorkoutCompleted && onResetProgress;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Упражнения тренировки {workoutTitle}</h2>
      {list.length === 0 ? (
        <p className={styles.emptyMessage}>В этой тренировке пока нет упражнений</p>
      ) : (
        <div className={styles.exerciseList}>
          {list.map((exercise, index) => {
            const percent = getExerciseProgressPercent(
              index,
              progressData,
              exercise.quantity
            );
            return (
              <div key={exercise._id} className={styles.exerciseItem}>
                <div className={styles.exerciseItem__header}>
                  <span className={styles.exerciseItem__name}>{exercise.name}</span>
                  <span className={styles.exerciseItem__percent}>{percent}%</span>
                </div>
                <div className={styles.progress__bar}>
                  <div
                    className={styles.progress__fill}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {list.length > 0 && (
        <div className={styles.submitBtn}>
          <button
            type="button"
            onClick={showResetButton ? onResetProgress : onFillProgress}
            className="btn"
          >
            {showResetButton
              ? 'Начать эту тренировку заново'
              : hasAnyProgress
                ? 'Обновить свой прогресс'
                : 'Заполнить свой прогресс'}
          </button>
        </div>
      )}
    </section>
  );
}
