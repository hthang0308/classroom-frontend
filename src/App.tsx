import { Alert, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { RouterProvider } from 'react-router-dom';

import router from './routes';
import HealthCheckProvider, { useHealthCheckContext } from './utils/HealthCheckContext';

import useColorScheme from '@/hooks/useColorScheme';

const HealthAlert = () => {
  const { isBackendHealthy, error } = useHealthCheckContext();

  if (isBackendHealthy) return null;

  return (
    <Alert color="red" title="Backend Service Unavailable" style={{ margin: '10px' }}>
      {error || 'Unable to connect to backend services. Some features may not work properly.'}
    </Alert>
  );
};

const App = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider position="top-right">
          <HealthCheckProvider>
            <HealthAlert />
            <RouterProvider router={router} />
          </HealthCheckProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
