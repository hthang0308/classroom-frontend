import { createBrowserRouter } from 'react-router-dom';

import RegisterPage from './components/authentication/register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

export default router;
