import { BasicObject, BaseResponse } from '@/api/types';
import axiosClient from '@/utils/axiosClient';

export interface User extends BasicObject {
  isLoggedInWithGoogle: boolean;
  email: string;
  name: string;
  isEmailVerified: boolean;
  groups: string[];
}

interface ChangePasswordSuccess {
  message: string;
}

const userApi = {
  getMe: () => (
    axiosClient.get<BaseResponse<User>>('/user/me')
  ),
  updateMe: (name: string, description: string) => (
    axiosClient.put<BaseResponse<User>>('/user/me', { name, description })
  ),
  changePassword: (oldPassword: string, newPassword: string) => (
    axiosClient.put<ChangePasswordSuccess>('/user/change-password', { oldPassword, newPassword })
  ),
};

export default userApi;
