import { AppShell } from '@mantine/core';
import React from 'react';

import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={<Header />}
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
