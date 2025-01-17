
export const AUTH_COOKIE = 'token';

export const USER_COOKIE = 'user';

export const APP_LOGOUT_EVENT = 'app-logout-even';

export const USER_ROLE: Record<string, string> = {
  OWNER: 'Owner',
  CO_OWNER: 'Co-owner',
  MEMBER: 'Member',
};

export const GROUP_FILTER_TYPE: Record<string, string> = {
  ALL: 'All',
  GROUP_YOU_JOINED: "Groups you've joined",
  GROUP_YOU_CREATED: "Groups you've created",
};
