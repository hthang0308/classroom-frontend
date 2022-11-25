import Cookies from 'js-cookie';
import { useJwt } from 'react-jwt';

import { AUTH_COOKIE } from '@/utils/constants';

export interface UserInfo {
  email: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  isLoggedInWithGoogle?: boolean;
}

export default function useUserInfo(): { userInfo: UserInfo | null } {
  const token = Cookies.get(AUTH_COOKIE);

  const { decodedToken, isExpired } = useJwt<UserInfo>(token as string);

  if (isExpired) {
    return { userInfo: null };
  }

  return { userInfo: decodedToken };
}
