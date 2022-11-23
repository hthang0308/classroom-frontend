import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUTH_COOKIE } from '@/utils/constants';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove(AUTH_COOKIE);
    navigate('/');
  });

  return (<div />);
}
