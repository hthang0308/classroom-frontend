import { USER_ROLE } from './constants';

import { UsersInfoAndRole } from '@/api/group';

export default function sortMemberListByRole(data: UsersInfoAndRole[]) {
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
