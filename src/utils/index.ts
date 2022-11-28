import Cookies from 'js-cookie';

import {
  USER_ROLE, GROUP_FILTER_TYPE, USER_COOKIE,
} from './constants';

import { UsersInfoAndRole, Group } from '@/api/group';

export interface UserGetFromCookie {
  id?: string
  email?: string
  name?: string
  isLoggedInWithGoogle?: boolean
}

export function sortMemberListByRole(data: UsersInfoAndRole[]) {
  const sortingScheme = [
    USER_ROLE.OWNER,
    USER_ROLE.CO_OWNER,
    USER_ROLE.MEMBER,
  ];

  const compare = (a: UsersInfoAndRole, b: UsersInfoAndRole) => {
    const indexOfa = sortingScheme.indexOf(a.role);
    const indexOfb = sortingScheme.indexOf(b.role);

    if (indexOfa > indexOfb) {
      return 1;
    }

    if (indexOfa < indexOfb) {
      return -1;
    }

    return 0;
  };

  return data.sort(compare);
}

export function getUserId() {
  const userString = Cookies.get(USER_COOKIE);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user: UserGetFromCookie = JSON.parse(userString || '');

  return user?.id;
}

export function filterGroupByType(groups: Group[], type: string | null, userId: string | undefined): Group[] {
  switch (type) {
    case GROUP_FILTER_TYPE.GROUP_YOU_CREATED: {
      return groups.filter((group) => group.userCreated._id === userId);
    }

    case GROUP_FILTER_TYPE.GROUP_YOU_JOINED: {
      return groups.filter((group) => group.userCreated._id !== userId);
    }

    default: {
      return groups;
    }
  }
}
