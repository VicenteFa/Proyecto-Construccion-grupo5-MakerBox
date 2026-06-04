import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { MainLayout } from '../layouts/MainLayout';
import { ROUTES } from '../constants/routes';
import { HomePage } from '../pages/HomePage';
import { SignUpPage } from '../pages/Sign-up';
import { AdminPage } from '../pages/admin/AdminPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME.path, element: <HomePage /> },
      { path: ROUTES.LOGIN.path, element: <LoginPage /> },
      { path: ROUTES.SIGN_UP.path, element: <SignUpPage /> },
      { path: ROUTES.ADMIN.path, element: <AdminPage /> },
    ],
  },
]);
