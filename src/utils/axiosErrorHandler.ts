import axios, { AxiosError } from 'axios';

export interface ErrorResponse {
  statusCode: number
  message: string
  error: string
}

export function isAxiosError<CustomErrorResponse>(error: unknown): error is AxiosError<CustomErrorResponse> {
  return axios.isAxiosError(error);
}
