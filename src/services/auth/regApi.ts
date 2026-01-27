import { BASE_URL } from '../constants';
import axios from 'axios';
import { createUserProp } from '@/sharedTypes/sharedTypes';

type RegisterResponse = {
  message: string;
};

/**
 * Регистрация нового пользователя
 * POST /auth/register
 * @param data - email и password
 * @returns Promise<RegisterResponse> - объект с сообщением об успехе
 */
export const regUser = (
  data: createUserProp,
): Promise<RegisterResponse> => {
  return axios
    .post<RegisterResponse>(
      BASE_URL + '/auth/register',
      data,
      {
        headers: {
          'Content-Type': '',
        },
      }
    )
    .then((res) => res.data);
};
