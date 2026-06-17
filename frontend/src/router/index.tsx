import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { MainLayout } from '../layouts/MainLayout';
import { ROUTES } from '../constants/routes';
import { HomePage } from '../pages/HomePage';
import { SignUpPage } from '../pages/Sign-up';
import { AdminPage } from '../pages/admin/AdminPage';
import { AyudanteMainPage } from '../pages/ayudante/AyudanteMainPage';
import { InventarioPage } from '../pages/ayudante/InventarioPage';
import { ReservasPage } from '../pages/ayudante/ReservasPage';
import { SolicitudPage } from '../pages/ayudante/SolicitudesPage';
import { MisCursosPage } from '../pages/profesor/MisCursosPage';
import { MisImpresionesPage } from '../pages/estudiante/MisImpresionesPage';
import { TestUsuarioPage } from '../pages/TestUsuarioPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/test-usuario', element: <TestUsuarioPage /> },
      { path: ROUTES.HOME.path, element: <HomePage /> },
      { path: ROUTES.LOGIN.path, element: <LoginPage /> },
      { path: ROUTES.SIGN_UP.path, element: <SignUpPage /> },
      { path: ROUTES.ADMIN.path, element: <AdminPage /> },
      { path: ROUTES.AYUDANTE.path, element: <AyudanteMainPage /> },
      { path: ROUTES.INVENTARIO.path, element: <InventarioPage /> },
      { path: ROUTES.RESERVAS.path, element: <ReservasPage /> },
      { path: ROUTES.SOLICITUD.path, element: <SolicitudPage /> },
      { path: ROUTES.PROFESOR.path, element: <MisCursosPage /> },
      {
        element: <ProtectedRoute allowedRoles={['ESTUDIANTE']} />,
        children: [{ path: ROUTES.ESTUDIANTE.path, element: <MisImpresionesPage /> }],
      },
    ],
  },
]);
