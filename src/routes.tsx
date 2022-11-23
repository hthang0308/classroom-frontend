import React, { useEffect } from 'react';
import {
  createBrowserRouter, Outlet, useNavigate,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import LoginPage from './components/authentication/login';
import Logout from './components/authentication/logout';
import RegisterPage from './components/authentication/register';
import NotFoundPage from './components/errorPage/notFound';

import { APP_LOGOUT_EVENT } from './utils/constants';

import UserProfile from '@/components/authentication/user-profile';
import Layout from '@/layout/Layout';

type Props = RouteObject & {
  name: string;
};

export const ROUTES: Props[] = [
  {
    index: true,
    name: 'Home',
    element: <div>Home</div>,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/register',
    name: 'Register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    name: 'Login',
    element: <LoginPage />,
  },
  {
    path: '/logout',
    name: 'Logout',
    element: <Logout />,
  },
  {
    path: '/profile',
    name: 'Profile',
    element: <UserProfile />,
  },
];

const LayoutRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(APP_LOGOUT_EVENT, () => {
      navigate('/logout');
    });
  });

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoute />,
    errorElement: <NotFoundPage />,
    children: ROUTES,
  },
]);

export default router;
