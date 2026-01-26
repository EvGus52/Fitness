import { BASE_URL } from '../constants';
import axios from 'axios';
import { CourseFromAPI } from '@/sharedTypes/sharedTypes';

/**
 * Получить все курсы
 * GET /api/fitness/courses
 * @returns Promise<CourseFromAPI[]> - массив всех курсов
 */
export const getCourses = (): Promise<CourseFromAPI[]> => {
  return axios
    .get<CourseFromAPI[]>(BASE_URL + '/courses')
    .then((res: { data: CourseFromAPI[] }) => res.data);
};
