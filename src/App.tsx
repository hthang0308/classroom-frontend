import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes } from 'react-router-dom';

import { ROUTES, renderRoutes } from './routes';

const App = () => (
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        {renderRoutes(ROUTES)}
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);

export default App;
