import { Route } from 'react-router-dom';

export interface RouteProps {
  name: string;
  path: string;
  element: React.ReactNode;
}

export const ROUTES: RouteProps[] = [
  {
    name: 'Home',
    path: '/',
    element: <div>Home</div>,
  },
  {
    name: 'Login',
    path: '/login',
    element: <div>Login</div>,
  },
];

export const renderRoutes = (
  routes: RouteProps[],
) => routes.map(({ path, element }) => (<Route key={path} path={path} element={element} />));
