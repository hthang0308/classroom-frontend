import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import * as notificationManager from '@/pages/common/notificationManager';

export default function LoginGoogle() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const userString = searchParams.get('user') || '';

  useEffect(() => {
    Cookies.set('token', token);
    Cookies.set('user', userString);

    notificationManager.showSuccess('', 'Login with Google successfully');
    navigate('/');
  }, [navigate, token, userString]);

  return null;
}
