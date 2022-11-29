import axiosClient from '@/utils/axiosClient';

export interface User {
  isLoggedInWithGoogle: boolean;
  _id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  groups: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface SuccessResponse {
  statusCode: string
  data: User
  message: string
}

const userApi = {
  getMe: () => (
    axiosClient.get<SuccessResponse>('/user/me')
  ),
  updateMe: (name: string, description: string) => (
    axiosClient.put<SuccessResponse>('/user/me', { name, description })
  ),
};

export default userApi;
