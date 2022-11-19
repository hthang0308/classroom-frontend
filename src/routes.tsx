import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import LoginPage from './components/authentication/login';
import RegisterPage from './components/authentication/register';
import NotFoundPage from './components/errorPage/notFound';

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
    name: 'register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    name: 'register',
    element: <LoginPage />,
  },
];

const LayoutRoute = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoute />,
    errorElement: <NotFoundPage />,
    children: ROUTES,
  },
]);

export default router;
