import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';

import router from './routes';

const App = () => (
  <MantineProvider>
    <RouterProvider router={router} />
  </MantineProvider>
);

export default App;
