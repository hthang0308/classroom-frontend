import { useEffect } from 'react';
import {
  createBrowserRouter, Outlet, useNavigate,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import UnauthorizedLayout from './layout/UnauthorizedLayout';
import LoginPage from './pages/authentication/login';
import LoginGoogle from './pages/authentication/login/loginGoogle';
import Logout from './pages/authentication/logout';
import RegisterPage from './pages/authentication/register';
import NotFoundPage from './pages/errorPage/notFound';
import GroupDetail from './pages/groups/groupDetail';
import JoinGroup from './pages/groups/joinGroup';
import GroupsPage from './pages/groups/list';
import Home from './pages/home';
import EditPresentation from './pages/presentation/editPresentation';
import PresentationList from './pages/presentation/list';
import ChangePasswordForm from './pages/user/change-password';

import ProfileEditor from './pages/user/edit-profile';

import { APP_LOGOUT_EVENT } from './utils/constants';

import Layout from '@/layout/Layout';
import ActivePresentation from '@/pages/presentation/active';
import UserProfile from '@/pages/user/user-profile';

type Props = RouteObject & {
  name: string;
};

export const AUTHORIZED_ROUTES: Props[] = [
  {
    index: true,
    name: 'Home',
    element: <Home />,
    errorElement: <NotFoundPage />,
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
  {
    path: '/groups',
    name: 'Groups',
    element: <GroupsPage />,
  },
  {
    path: '/group/:groupId',
    name: 'Group',
    element: <GroupDetail />,
  },
  {
    path: '/presentations',
    name: 'Presentations',
    element: <PresentationList />,
  },
  {
    path: '/presentation/:presentationId/:slideId/edit',
    name: 'Presentation',
    element: <EditPresentation />,
  },
  {
    path: '/presentation/active/:presentationId',
    name: 'Present',
    element: <ActivePresentation />,
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

const UNAUTHORIZED_ROUTES: Props[] = [
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
    path: '/login/google',
    name: 'Login Google',
    element: <LoginGoogle />,
  },
  {
    path: '/group/invite',
    name: 'Invite',
    element: <JoinGroup />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoute />,
    errorElement: <NotFoundPage />,
    children: AUTHORIZED_ROUTES,
  },
  ...UNAUTHORIZED_ROUTES.map(({
    path, name, element,
  }) => ({
    path,
    name,
    element: <UnauthorizedLayout>{element}</UnauthorizedLayout>,
  })),
]);

export default router;
