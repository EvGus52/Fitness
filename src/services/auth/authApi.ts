import { BASE_URL } from '../constants';
import axios from 'axios';
import { createUserProp } from '@/sharedTypes/sharedTypes';

type LoginResponse = {
  token: string;
};

type RegisterResponse = {
  message: string;
};

/**
 * Авторизация пользователя
 * POST /auth/login
 * @param data - email и password
 * @returns Promise<LoginResponse> - объект с токеном
 */
export const loginUser = (
  data: createUserProp,
): Promise<LoginResponse> => {
  return axios
    .post<LoginResponse>(
      BASE_URL + '/auth/login',
      data,
      {
        headers: {
          'Content-Type': '',
        },
      }
    )
    .then((res) => res.data);
};

/**
 * Сохранение токена в localStorage
 * @param token - JWT токен
 */
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Получение токена из localStorage
 * @returns string | null
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Удаление токена из localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Получение заголовков с Bearer токеном для авторизованных запросов
 * @returns объект с заголовком Authorization
 */
export const getAuthHeaders = (): { Authorization: string } | {} => {
  const token = getToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};
