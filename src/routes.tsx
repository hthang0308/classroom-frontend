import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import UnauthorizedLayout from './layout/unauthorizedLayout';
import ForgotPasswordPage from './pages/authentication/forgotPassword';
import LoginPage from './pages/authentication/login';
import LoginGoogle from './pages/authentication/login/loginGoogle';
import Logout from './pages/authentication/logout';
import RegisterPage from './pages/authentication/register';
import RenewPasswordPage from './pages/authentication/renewPassword';
import NotFoundPage from './pages/errorPage/notFound';
import GroupDetail from './pages/groups/details';
import JoinGroup from './pages/groups/join';
import GroupsPage from './pages/groups/list';
import Home from './pages/home';
import PresentationCollaboration from './pages/presentation/collaboration';
import EditPresentation from './pages/presentation/edit';
import PresentationList from './pages/presentation/list';
import ChangePasswordForm from './pages/user/changePassword';

import ProfileEditor from './pages/user/editProfile';

import Layout from '@/layout/layout';
import GroupPresentation from '@/pages/presentation/active/groupPresentation';
import GuestPresentation from '@/pages/presentation/active/guestPresentation';
import HostPresentation from '@/pages/presentation/active/hostPresentation';
import UserProfile from '@/pages/user/userProfile';

type Props = RouteObject & {
  name: string;
  noHeader?: boolean;
};

const AUTHORIZED_ROUTES: Props[] = [
  {
    path: '/',
    name: 'Home',
    element: <Home />,
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
    path: '/presentation/:presentationId/collaboration',
    name: 'Presentation Collaboration',
    element: <PresentationCollaboration />,
  },
  {
    path: '/presentation/active/:presentationId',
    name: 'Present',
    element: <HostPresentation />,
    noHeader: true,
  },
  {
    path: '/presentation/active/:presentationId/group',
    name: 'Present',
    element: <GroupPresentation />,
  },
  {
    path: '/presentation/join',
    name: 'Join Present',
    element: <GuestPresentation />,
  },
];

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
    path: '/forgot-password',
    name: 'Forgot Password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/renew-password',
    name: 'Renew Password',
    element: <RenewPasswordPage />,
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
    element: <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      ...AUTHORIZED_ROUTES.map(({ path, name, element, noHeader }) => ({
        path,
        name,
        element: <Layout noHeader={noHeader || false}>{element}</Layout>,
      })),
      ...UNAUTHORIZED_ROUTES.map(({ path, name, element }) => ({
        path,
        name,
        element: <UnauthorizedLayout>{element}</UnauthorizedLayout>,
      })),
    ],
  },
]);

export default router;
