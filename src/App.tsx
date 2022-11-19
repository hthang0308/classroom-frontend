import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './routes';

import useColorScheme from '@/hooks/useColorScheme';

const App = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
