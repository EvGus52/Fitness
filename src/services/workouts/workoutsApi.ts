import { BASE_URL } from '../constants';
import axios from 'axios';
import { getAuthHeaders } from '../auth/authApi';
import { Workout } from '@/sharedTypes/sharedTypes';

/**
 * Получить данные по тренировке
 * GET /workouts/[workoutId]
 * Требует авторизации (Bearer token)
 * @param workoutId - ID тренировки
 * @returns Promise<Workout> - данные тренировки
 */
export const getWorkoutById = (workoutId: string): Promise<Workout> => {
  const headers = getAuthHeaders();
  return axios
    .get<Workout>(BASE_URL + `/workouts/${workoutId}`, {
      headers,
    })
    .then((res) => res.data);
};

/**
 * Сохранить прогресс тренировки
 * PATCH /courses/[courseId]/workouts/[workoutId]
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @param workoutId - ID тренировки
 * @param progressData - массив чисел повторений для каждого упражнения
 * @returns Promise<void>
 */
export const saveWorkoutProgress = (
  courseId: string,
  workoutId: string,
  progressData: number[],
): Promise<void> => {
  const headers = { ...getAuthHeaders(), 'Content-Type': '' };
  return axios
    .patch(
      BASE_URL + `/courses/${courseId}/workouts/${workoutId}`,
      { progressData },
      {
        headers,
      },
    )
    .then(() => undefined);
};

/**
 * Удалить весь прогресс по тренировке
 * PATCH /courses/[courseId]/workouts/[workoutId]/reset
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @param workoutId - ID тренировки
 * @returns Promise<ResetProgressResponse> - сообщение об успехе
 */
export const resetWorkoutProgress = (
  courseId: string,
  workoutId: string,
): Promise<{ message: string }> => {
  const headers = { ...getAuthHeaders(), 'Content-Type': '' };
  return axios
    .patch<{ message: string }>(
      BASE_URL + `/courses/${courseId}/workouts/${workoutId}/reset`,
      {},
      {
        headers,
      },
    )
    .then((res) => res.data);
};
