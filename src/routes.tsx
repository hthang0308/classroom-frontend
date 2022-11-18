import { createBrowserRouter } from 'react-router-dom';

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
]);

export default router;
