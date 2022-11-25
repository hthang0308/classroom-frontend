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

export interface Meta {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRows: number
}

interface SuccessResponseType {
  statusCode: string
  data: Group
  message: string
}

interface GetAllResponseType {
  statusCode: string
  data: Group[]
  message: string
  meta: Meta
}

const groupApi = {
  createGroup: (name: string, description: string | undefined) => (
    axiosClient.post<SuccessResponseType>('/group', {
      name,
      description,
    })
  ),
  getAll: (params: { pageSize?: number, page?: number }) => {
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const page = params.page && params.page > 0 ? params.page : 1;

    return axiosClient.get<GetAllResponseType>(`/group?size=${pageSize}&page=${page}`);
  },
  getGroupById: (id: string) => (
    axiosClient.get<SuccessResponseType>(`/group/${id}`)
  ),
};

export default groupApi;
