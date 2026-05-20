import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { MainLayout } from '../layouts/MainLayout';
import { ROUTES } from '../constants/routes';
import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
    ],
  },
]);
