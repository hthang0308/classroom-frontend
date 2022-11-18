import axios, { AxiosError } from 'axios';

export interface ErrorReponse {
  statusCode: number
  message: string
  error: string
}

export function isAxiosError<CustomErrorReponse>(error: unknown): error is AxiosError<CustomErrorReponse> {
  return axios.isAxiosError(error);
}
