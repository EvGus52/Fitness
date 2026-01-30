import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  isNetworkError,
  getAxiosErrorMessage,
  getAxiosErrorToastMessage,
} from './errorUtils';

const mockConfig = {} as InternalAxiosRequestConfig;

function makeAxiosResponse<T>(data: T, status: number): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: '',
    headers: {},
    config: mockConfig,
  } as AxiosResponse<T>;
}

describe('isNetworkError', () => {
  it('returns true for network error, false when response exists', () => {
    expect(isNetworkError(new Error('Network Error'))).toBe(true);
    const err = new AxiosError(
      'msg',
      'ERR_BAD_REQUEST',
      mockConfig,
      {},
      makeAxiosResponse({}, 400),
    );
    expect(isNetworkError(err)).toBe(false);
  });
});

describe('getAxiosErrorMessage', () => {
  it('returns message from API or fallback', () => {
    const err = new AxiosError(
      'msg',
      undefined,
      mockConfig,
      undefined,
      makeAxiosResponse({ message: 'Email already exists' }, 400),
    );
    expect(getAxiosErrorMessage(err, 'Fallback')).toBe('Email already exists');
    expect(getAxiosErrorMessage(new Error('x'), 'Fallback')).toBe('Fallback');
  });
});

describe('getAxiosErrorToastMessage', () => {
  it('returns "Пропал интернет" for network error, else API message or fallback', () => {
    expect(
      getAxiosErrorToastMessage(new Error('Network Error'), 'Fallback'),
    ).toBe('Пропал интернет');
    const err = new AxiosError(
      'msg',
      undefined,
      mockConfig,
      undefined,
      makeAxiosResponse({ message: 'Invalid password' }, 401),
    );
    expect(getAxiosErrorToastMessage(err, 'Fallback')).toBe('Invalid password');
  });
});
