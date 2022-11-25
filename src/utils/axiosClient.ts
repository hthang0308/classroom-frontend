import axios, { AxiosRequestConfig } from 'axios';
import appConfig from 'config';

import { APP_LOGOUT_EVENT } from './constants';

import getJwtToken from '@/utils/getJwtToken';

const axiosClient = axios.create({
  baseURL: appConfig.backendUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { jwtToken, isExpired } = getJwtToken();

    if (!jwtToken || isExpired) {
      document.dispatchEvent(new CustomEvent(APP_LOGOUT_EVENT, {}));
      return config;
    }

    config.headers.Authorization = `Bearer ${jwtToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
