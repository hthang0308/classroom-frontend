
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

export const COLORS = [
  'rgba(255, 99, 132, 0.3)',
  'rgba(255, 159, 64, 0.3)',
  'rgba(255, 205, 86, 0.3)',
  'rgba(75, 192, 192, 0.3)',
  'rgba(54, 162, 235, 0.3)',
  'rgba(153, 102, 255, 0.3)',
  'rgba(201, 203, 207, 0.3)',
  'rgba(255, 99, 132, 0.3)',
  'rgba(255, 159, 64, 0.3)',
  'rgba(255, 205, 86, 0.3)',
];

export enum SlideType {
  MultipleChoice = 'MULTIPLE_CHOICE',
  Heading = 'HEADING',
  Paragraph = 'PARAGRAPH',
}
