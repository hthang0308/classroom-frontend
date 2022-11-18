import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { RouterProvider } from 'react-router-dom';

import router from './routes';

const App = () => (
  <MantineProvider>
    <NotificationsProvider position="top-right">
      <RouterProvider router={router} />
    </NotificationsProvider>
  </MantineProvider>
);

export default App;
