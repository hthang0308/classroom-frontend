import axiosClient from '@/utils/axiosClient';

export interface UsersAndRole {
  user: string
  role: string
}

export interface UserCreated {
  _id: string
  email: string
  name: string
}

export interface Group {
  _id: string
  name: string
  description: string;
  usersAndRoles: UsersAndRole[]
  userCreated: UserCreated
  userUpdated: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

interface SuccessResponse {
  statusCode: string
  data: Group
  message: string
}

const groupApi = {
  createGroup: (name: string, description: string | undefined) => (
    axiosClient.post<SuccessResponse>('/group', {
      name,
      description,
    })
  ),
};

export default groupApi;
