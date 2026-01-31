import { BASE_URL } from '../constants';
import axios from 'axios';
import { getAuthHeaders } from '../auth/authApi';
import { AddCourseResponse, DeleteCourseResponse } from '@/sharedTypes/sharedTypes';

/**
 * Добавить курс для пользователя
 * POST /users/me/courses
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса для добавления
 * @returns Promise<AddCourseResponse> - сообщение об успехе
 */
export const addUserCourse = (courseId: string): Promise<AddCourseResponse> => {
  const headers = { ...getAuthHeaders(), 'Content-Type': '' };
  return axios
    .post<AddCourseResponse>(
      BASE_URL + '/users/me/courses',
      { courseId },
      {
        headers,
      },
    )
    .then((res) => res.data);
};

/**
 * Удалить курс у пользователя
 * DELETE /users/me/courses/[courseId]
 * Требует авторизации (Bearer token)
 * @param courseId - ID курса для удаления
 * @returns Promise<DeleteCourseResponse> - сообщение об успехе
 */
export const deleteUserCourse = (
  courseId: string,
): Promise<DeleteCourseResponse> => {
  const headers = getAuthHeaders();
  return axios
    .delete<DeleteCourseResponse>(BASE_URL + `/users/me/courses/${courseId}`, {
      headers,
    })
    .then((res) => res.data);
};
