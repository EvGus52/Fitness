'use client';

import { useEffect, useState, useRef } from 'react';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import { Exercise } from '@/sharedTypes/sharedTypes';
import { saveWorkoutProgress } from '@/services/workouts/workoutsApi';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils/errorUtils';

import styles from './progressModal.module.css';

interface ProgressModalProps {
  isOpen: boolean;
  courseId: string;
  workoutId: string;
  exercises: Exercise[];
  initialProgressData: number[];
  onSave: () => void;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function ProgressModal({
  isOpen,
  courseId,
  workoutId,
  exercises,
  initialProgressData,
  onSave,
  onClose,
  onSaveSuccess,
}: ProgressModalProps) {
  const [values, setValues] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current && exercises.length) {
      setValues(exercises.map(() => 0));
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, exercises.length]);

  useModalBodyLock(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleChange = (index: number, value: string) => {
    const num = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    setValues((prev) => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Суммируем введённые значения с предыдущим прогрессом
      const totalProgress = exercises.map((_, i) => {
        const prev = initialProgressData[i] ?? 0;
        const added = values[i] ?? 0;
        return prev + added;
      });
      await saveWorkoutProgress(courseId, workoutId, totalProgress);
      onSave();
      onSaveSuccess?.();
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error, 'Ошибка при сохранении прогресса'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal__block} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <h2 className={styles.modal__title}>Мой прогресс</h2>
          {exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.field}>
              <label htmlFor={`progress-${exercise._id}`} className={styles.field__label}>
                Сколько раз вы сделали {exercise.name.replace(/\?$/, '')}?
              </label>
              <input
                id={`progress-${exercise._id}`}
                type="number"
                min={0}
                placeholder="0"
                className={styles.field__input}
                value={values[index] !== undefined && values[index] !== 0 ? values[index] : ''}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className={styles.saveBtn}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="btn btn-full btn-padding-sm"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
