import {
  BasicObject, BasicResponse, CompactUser, PagingData, BaseResponse,
} from '@/api/types';
import axiosClient from '@/utils/axiosClient';

export interface UsersAndRole {
  user: string
  role: string
}

export interface UsersInfoAndRole {
  user: CompactUser;
  role: string;
}

interface BasicGroup extends BasicObject {
  name: string
  description: string;
  userUpdated: string
}

export interface Group extends BasicGroup {
  usersAndRoles: UsersAndRole[]
  userCreated: CompactUser;
}

export interface Group2 extends BasicGroup {
  usersAndRoles: UsersInfoAndRole[];
  userCreated: CompactUser;
}

export interface Group3 extends BasicGroup {
  usersAndRoles: UsersInfoAndRole[];
  userCreated: string;
}

interface GetAllResponseType extends BaseResponse<Group[]> {
  meta: PagingData
}

const groupApi = {
  createGroup: (name: string, description: string | undefined) => (
    axiosClient.post<BaseResponse<Group>>('/group', {
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
    axiosClient.get<BaseResponse<Group>>(`/group/${id}`)
  ),
  getMyGroups: () => (
    axiosClient.get<BaseResponse<Group[]>>('/group/my-group')
  ),
  getInvitationLink: (id: string | undefined) => (
    axiosClient.get<BaseResponse<string>>(`/group/${id}/get-invite-link`)
  ),
  inviteUserViaEmail: (id: string | undefined, email: string) => (
    axiosClient.post<BasicResponse>(`/group/${id}/invite-user-by-email`, { email })
  ),
  joinGroup: (token: string) => (
    axiosClient.get<BaseResponse<Group3>>(`/group/invite/${token}`)
  ),
  getAllMembers: (id: string | undefined) => (
    axiosClient.get<BaseResponse<Group2>>(`/group/${id}`)
  ),
  assignMemberRole: (groupId: string | undefined, userId: string | undefined, role: string) => (
    axiosClient.post<BasicResponse>(`/group/${groupId}/assign-role`, {
      user: userId,
      role,
    })
  ),
  leaveGroup: (groupId: string | undefined) => (
    axiosClient.get<BasicResponse>(`/group/${groupId}/leave`)
  ),
  kickOutMember: (groupId: string | undefined, userId: string | undefined) => (
    axiosClient.get<BasicResponse>(`/group/${groupId}/kick?userId=${userId}`)
  ),
  deleteGroup: (groupId: string | undefined) => (
    axiosClient.delete<BasicResponse>(`/group/${groupId}`)
  ),
};

export default groupApi;
