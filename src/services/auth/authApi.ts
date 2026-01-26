import { BASE_URL } from '../constants';
import axios from 'axios';
import { createUserProp } from '@/sharedTypes/sharedTypes';

export const loginUser = (data: createUserProp) => {
  return axios.post(BASE_URL + '/user/login/', data);
};

type accessTokenType = {
  access: string;
};

type refreshTokenType = {
  refresh: string;
};

type tokensType = accessTokenType & refreshTokenType;

export const getTokens = (data: createUserProp): Promise<tokensType> => {
  return axios.post(BASE_URL + '/user/token/', data).then((res) => res.data);
};

export const refreshToken = (refresh: string): Promise<accessTokenType> => {
  return axios
    .post(BASE_URL + '/user/token/refresh/', { refresh })
    .then((res) => res.data);
};
