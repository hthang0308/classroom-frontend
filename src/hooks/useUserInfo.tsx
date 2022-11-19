import Cookies from 'js-cookie';
import { useJwt } from 'react-jwt';

export interface UserInfo {
  email: string;
  name: string;
}

export default function useUserInfo(): { userInfo: UserInfo | null } {
  const token = Cookies.get('token');
  const { decodedToken, isExpired } = useJwt<UserInfo>(token as string);

  if (isExpired) {
    return { userInfo: null };
  }

  return { userInfo: decodedToken };
}
