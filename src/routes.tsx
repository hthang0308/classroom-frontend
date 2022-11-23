import React, { useEffect } from 'react';
import {
  createBrowserRouter, Outlet, useNavigate,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import LoginPage from './components/authentication/login';
import Logout from './components/authentication/logout';
import RegisterPage from './components/authentication/register';
import NotFoundPage from './components/errorPage/notFound';
import ChangePasswordForm from './components/user/change-password';

import ProfileEditor from './components/user/edit-profile';

import { APP_LOGOUT_EVENT } from './utils/constants';

import UserProfile from '@/components/user/user-profile';

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
