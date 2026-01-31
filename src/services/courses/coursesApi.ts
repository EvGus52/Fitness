import { BASE_URL } from '../constants';
import axios from 'axios';
import { CourseFromAPI, Workout, ResetProgressResponse } from '@/sharedTypes/sharedTypes';
import { getAuthHeaders } from '../auth/authApi';

/**
 * Получить все курсы
 * GET /courses
 * @returns Promise<CourseFromAPI[]> - массив всех курсов
 */
export const getCourses = (): Promise<CourseFromAPI[]> => {
  return axios
    .get<CourseFromAPI[]>(BASE_URL + '/courses')
    .then((res: { data: CourseFromAPI[] }) => res.data);
};

/**
 * Получить один курс по ID
 * GET /courses/[courseId]
 * @param courseId - ID курса
 * @returns Promise<CourseFromAPI> - данные курса
 */
export const getCourseById = (courseId: string): Promise<CourseFromAPI> => {
  return axios
    .get<CourseFromAPI>(BASE_URL + `/courses/${courseId}`)
    .then((res) => res.data);
};

/**
 * Получить список тренировок курса
 * GET /courses/[courseId]/workouts
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @returns Promise<Workout[]> - массив тренировок
 */
export const getCourseWorkouts = (courseId: string): Promise<Workout[]> => {
  const headers = getAuthHeaders();
  return axios
    .get<Workout[]>(BASE_URL + `/courses/${courseId}/workouts`, {
      headers,
    })
    .then((res) => res.data);
};

/**
 * Удалить весь прогресс по курсу
 * PATCH /courses/[courseId]/reset
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса
 * @returns Promise<ResetProgressResponse> - сообщение об успехе
 */
export const resetCourseProgress = (
  courseId: string,
): Promise<ResetProgressResponse> => {
  const headers = { ...getAuthHeaders(), 'Content-Type': '' };
  return axios
    .patch<ResetProgressResponse>(BASE_URL + `/courses/${courseId}/reset`, {}, {
      headers,
    })
    .then((res) => res.data);
};
