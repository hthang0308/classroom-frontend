import axiosClient from '@/utils/axiosClient';

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface UsersAndRole {
  user: string
  role: string
}

export interface UsersInfoAndRole {
  user: User;
  role: string;
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

export interface Group2 {
  _id: string;
  name: string;
  description: string;
  usersAndRoles: UsersInfoAndRole[];
  userCreated: UserCreated;
  userUpdated: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
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

interface GetMyGroupResponseType {
  statusCode: string
  data: Group[]
  message: string
}

interface GetLinkResponseType {
  statusCode: string
  data: string
  message: string
}

interface InviteViaEmailResponseType {
  statusCode: string
  message: string
}

interface GetAllMemberResponseType {
  statusCode: string
  data: Group2
  message: string
}

interface AssignRoleResponseType {
  statusCode: string
  message: string
}

interface LeaveGroupResponseType {
  statusCode: string
  message: string
}

interface KickOutResponseType {
  statusCode: string
  message: string
}

interface DeleteGroupResponseType {
  statusCode: string
  message: string
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
  getGroupById: (id: string | undefined) => (
    axiosClient.get<SuccessResponseType>(`/group/${id}`)
  ),
  getMyGroups: () => (
    axiosClient.get<GetMyGroupResponseType>('/group/my-group')
  ),
  getInvitationLink: (id: string | undefined) => (
    axiosClient.get<GetLinkResponseType>(`/group/${id}/get-invite-link`)
  ),
  inviteUserViaEmail: (id: string | undefined, email: string) => (
    axiosClient.post<InviteViaEmailResponseType>(`/group/${id}/invite-user-by-email`, { email })
  ),
  getAllMembers: (id: string | undefined) => (
    axiosClient.get<GetAllMemberResponseType>(`/group/${id}`)
  ),
  assignMemberRole: (groupId: string | undefined, userId: string | undefined, role: string) => (
    axiosClient.post<AssignRoleResponseType>(`/group/${groupId}/assign-role`, {
      user: userId,
      role,
    })
  ),
  leaveGroup: (groupId: string | undefined) => (
    axiosClient.get<LeaveGroupResponseType>(`/group/${groupId}/leave`)
  ),
  kickOutMember: (groupId: string | undefined, userId: string | undefined) => (
    axiosClient.get<KickOutResponseType>(`/group/${groupId}/kick?userId=${userId}`)
  ),
  deleteGroup: (groupId: string | undefined) => (
    axiosClient.delete<DeleteGroupResponseType>(`/group/${groupId}`)
  ),
};

export default groupApi;
