import { BASE_URL } from '../constants';
import axios, { AxiosResponse } from 'axios';

type regUserProps = {
  email: string;
  password: string;
  username: string;
};

type regUserReturn = {
  username: string;
  email: string;
  _id: number;
};

export const regUser = (
  data: regUserProps,
): Promise<AxiosResponse<regUserReturn>> => {
  return axios.post<regUserReturn>(BASE_URL + '/user/signup/', data, {
    headers: {
      'content-type': 'application/json',
    },
  });
};
