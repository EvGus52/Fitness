import { BASE_URL } from '../constants';
import axios from 'axios';
import { getAuthHeaders } from '../auth/authApi';
import {
  CourseProgress,
  WorkoutProgress,
} from '@/sharedTypes/sharedTypes';

/**
 * Получить прогресс пользователя по всему курсу
 * GET /users/me/progress?courseId={courseId}
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @returns Promise<CourseProgress> - прогресс по курсу
 */
export const getCourseProgress = (
  courseId: string,
): Promise<CourseProgress> => {
  const headers = getAuthHeaders();
  return axios
    .get<CourseProgress>(BASE_URL + `/users/me/progress?courseId=${courseId}`, {
      headers,
    })
    .then((res) => res.data);
};

/**
 * Получить прогресс пользователя по тренировке
 * GET /users/me/progress?courseId={courseId}&workoutId={workoutId}
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @param workoutId - ID тренировки
 * @returns Promise<WorkoutProgress> - прогресс по тренировке
 */
export const getWorkoutProgress = (
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress> => {
  const headers = getAuthHeaders();
  return axios
    .get<WorkoutProgress>(
      BASE_URL + `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
      {
        headers,
      },
    )
    .then((res) => res.data);
};
