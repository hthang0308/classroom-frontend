import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from 'config';

import { APP_LOGOUT_EVENT } from './constants';

import getJwtToken from '@/utils/getJwtToken';

const axiosRequest = (
  method: Function, endpoint: string, options: AxiosRequestConfig<any>,
): Promise<AxiosResponse<any, any>> => {
  const { jwtToken, isExpired } = getJwtToken();

  if (!jwtToken || isExpired) {
    document.dispatchEvent(new CustomEvent(APP_LOGOUT_EVENT, {}));
    return undefined as any;
  }

  const configs = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  return method(`${config.backendUrl}${endpoint}`, { ...options, ...configs });
};

export const get = async (
  endpoint: string, options: AxiosRequestConfig<any>,
) => axiosRequest(axios.get, endpoint, options);

export const post = async (
  endpoint: string, options: AxiosRequestConfig<any>,
) => axiosRequest(axios.post, endpoint, options);

export const put = async (
  endpoint: string, options: AxiosRequestConfig<any>,
) => axiosRequest(axios.put, endpoint, options);
