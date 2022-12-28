
export const AUTH_COOKIE = 'token';

export const USER_COOKIE = 'user';

export const APP_LOGOUT_EVENT = 'app-logout-even';

export const UserRole = {
  Owner: 'OWNER',
  CoOwner: 'CO_OWNER',
  Member: 'MEMBER',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const UserRoleDisplay: { [K in UserRoleType]: string } = {
  [UserRole.Owner]: 'Owner',
  [UserRole.CoOwner]: 'Co-Owner',
  [UserRole.Member]: 'Member',
};

export const GROUP_FILTER_TYPE: Record<string, string> = {
  ALL: 'All',
  GROUP_YOU_JOINED: "Groups you've joined",
  GROUP_YOU_CREATED: "Groups you've created",
};

export const SlideTypes = {
  multipleChoice: 'MULTIPLE_CHOICE',
  heading: 'HEADING',
  paragraph: 'PARAGRAPH',
} as const;

export type SlideTypesType = typeof SlideTypes[keyof typeof SlideTypes];
