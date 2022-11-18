import { createBrowserRouter } from 'react-router-dom';

import LoginPage from './components/authentication/login';
import RegisterPage from './components/authentication/register';
import NotFoundPage from './components/errorPage/notFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
