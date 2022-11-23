
import Cookies from 'js-cookie';

import { AUTH_COOKIE } from '@/utils/constants';

function urlBase64Decode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');

  switch (output.length % 4) {
    case 0: {
      break;
    }

    case 2: {
      output += '==';
      break;
    }

    case 3: {
      output += '=';
      break;
    }

    default: {
      throw new Error('Illegal base64url string!');
    }
  }

  return decodeURIComponent(window.escape(atob(output)));
}

function getTokenData(token: string) {
  const payload = token.split('.')[1];
  const tokenData = urlBase64Decode(payload);

  try {
    return JSON.parse(tokenData);
  } catch {
    return tokenData;
  }
}

interface JwtPayload {
  exp: number;
  iat: number;
}

export default function getJwtToken(): { jwtToken: string | undefined, isExpired?: boolean } {
  const jwtToken = Cookies.get(AUTH_COOKIE);

  if (!jwtToken) {
    return { jwtToken: undefined, isExpired: true };
  }

  const decoded = getTokenData(jwtToken) as JwtPayload;
  const isExpired = decoded.exp * 1000 < Date.now();

  return { jwtToken, isExpired };
}
