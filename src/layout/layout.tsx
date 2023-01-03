import { AppShell } from '@mantine/core';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from './header';

import { AUTH_COOKIE, APP_LOGOUT_EVENT } from '@/utils/constants';

export default function Layout({ noHeader, children }: { noHeader: boolean, children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(APP_LOGOUT_EVENT, () => {
      navigate('/logout');
    });
  });

  useEffect(() => {
    if (!Cookies.get(AUTH_COOKIE)) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <AppShell
      header={noHeader ? undefined : <Header />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
