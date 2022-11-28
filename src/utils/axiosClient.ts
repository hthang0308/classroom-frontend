import axios, { AxiosRequestConfig } from 'axios';
import appConfig from 'config';

import { APP_LOGOUT_EVENT } from './constants';

import getJwtToken from '@/utils/getJwtToken';

const axiosClient = axios.create({
  baseURL: appConfig.backendUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const cf = config;
    const { jwtToken, isExpired } = getJwtToken();

    if (!jwtToken || isExpired) {
      document.dispatchEvent(new CustomEvent(APP_LOGOUT_EVENT, {}));
      return cf;
    }

    cf.headers = { Authorization: `Bearer ${jwtToken}` };

    return cf;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
