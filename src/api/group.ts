import {
  BasicObject, BasicResponse, CompactUser, PagingData, BaseResponse,
} from '@/api/types';
import axiosClient from '@/utils/axiosClient';
import { UserRoleType } from '@/utils/constants';

export interface UsersAndRole {
  user: string
  role: UserRoleType
}

export interface UsersInfoAndRole {
  user: CompactUser;
  role: UserRoleType;
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
  createGroup: (name: string, description?: string) => (
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
  getGroupById: (id?: string) => (
    axiosClient.get<BaseResponse<Group>>(`/group/${id}`)
  ),
  getMyGroups: () => (
    axiosClient.get<BaseResponse<Group[]>>('/group/my-group')
  ),
  getMyCreatedGroups: () => (
    axiosClient.get<BaseResponse<Group[]>>('/group/my-created-group')
  ),
  getInvitationLink: (id?: string) => (
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
  assignMemberRole: (groupId: string | undefined, userId: string | undefined, role: UserRoleType) => (
    axiosClient.post<BasicResponse>(`/group/${groupId}/assign-role`, {
      user: userId,
      role,
    })
  ),
  leaveGroup: (groupId?: string) => (
    axiosClient.get<BasicResponse>(`/group/${groupId}/leave`)
  ),
  kickOutMember: (groupId?: string, userId?: string) => (
    axiosClient.get<BasicResponse>(`/group/${groupId}/kick?userId=${userId}`)
  ),
  deleteGroup: (groupId?: string) => (
    axiosClient.delete<BasicResponse>(`/group/${groupId}`)
  ),
};

export default groupApi;
