
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

export const SLIDE_TYPE: Record<string, string> = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  HEADING: 'HEADING',
  PARAGRAPH: 'PARAGRAPH',
};

export const CHART_TYPE: Record<string, string> = {
  BARS_CHART: 'Bars chart',
  DONUT_CHART: 'Donut chart',
  PIE_CHART: 'Pie chart',
  DOTS_CHART: 'Dots chart',
};
