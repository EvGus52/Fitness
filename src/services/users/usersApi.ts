import { BASE_URL } from '../constants';
import axios from 'axios';
import { getAuthHeaders } from '../auth/authApi';

export type UserData = {
  email: string;
  selectedCourses: string[];
};

type UserResponse = {
  user: {
    _id: string;
    email: string;
    password: string;
    selectedCourses: string[];
    courseProgress: unknown[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

/**
 * Получить данные текущего пользователя
 * GET /users/me
 * Требует авторизации (Bearer token)
 * @returns Promise<UserData> - данные пользователя
 */
export const getCurrentUser = (): Promise<UserData> => {
  const headers = getAuthHeaders();
  return axios
    .get<UserResponse>(BASE_URL + '/users/me', {
      headers,
    })
    .then((res) => {
      // Преобразуем ответ сервера в формат для приложения
      return {
        email: res.data.user.email,
        selectedCourses: res.data.user.selectedCourses || [],
      };
    });
};
