import { createBrowserRouter } from 'react-router';
import { Home } from '../features/home/components/Home';
import { Login } from '../features/login/components/Login';
import { Layout } from '../features/layout/components/Layout';
import { ROUTES } from '../constants/routes';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: ROUTES.HOME, element: <Home /> },
      { path: ROUTES.LOGIN, element: <Login /> },
    ],
  },
]);
