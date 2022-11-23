import React, { useEffect } from 'react';
import {
  createBrowserRouter, Outlet, useNavigate,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import LoginPage from './pages/authentication/login';
import Logout from './pages/authentication/logout';
import RegisterPage from './pages/authentication/register';
import NotFoundPage from './pages/errorPage/notFound';
import Home from './pages/home';
import ChangePasswordForm from './pages/user/change-password';

import ProfileEditor from './pages/user/edit-profile';

import { APP_LOGOUT_EVENT } from './utils/constants';

import Layout from '@/layout/Layout';
import UserProfile from '@/pages/user/user-profile';

type Props = RouteObject & {
  name: string;
};

export const ROUTES: Props[] = [
  {
    index: true,
    name: 'Home',
    element: <Home />,
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
    path: '/user/profile',
    name: 'Profile',
    element: <UserProfile />,
  },
  {
    path: '/user/change-password',
    name: 'Profile',
    element: <ChangePasswordForm />,
  },
  {
    path: '/user/edit-profile',
    name: 'Profile',
    element: <ProfileEditor />,
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
