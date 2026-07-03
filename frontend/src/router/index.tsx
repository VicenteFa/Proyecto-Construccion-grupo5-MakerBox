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
import { MisImpresionesPage } from '../pages/estudiante/MisImpresionesPage';
import { TestUsuarioPage } from '../pages/TestUsuarioPage';
import { ProtectedRoute } from './ProtectedRoute';
import { CrearCurso } from '../pages/curso/CrearCurso';
import { CursoDetallePage } from '../pages/curso/CursoDetalle';
import { ProfesorDashboard } from '../pages/profesor/ProfesorDashboard';
import { EstudianteDashboard } from '../pages/estudiante/EstudianteDashboard';
import { AdminEstudiantesPage } from '../pages/admin/AdminEstudiantesPage';
import { AdminInventarioPage } from '../pages/admin/AdminInventarioPage';

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
      { path: ROUTES.ADMIN_ESTUDIANTES.path, element: <AdminEstudiantesPage /> },
      { path: ROUTES.ADMIN_INVENTARIO.path, element: <AdminInventarioPage /> },

      {
        element: <ProtectedRoute allowedRoles={['ESTUDIANTE']} />,
        children: [
          // dashboard principal
          { path: ROUTES.ESTUDIANTE.path, element: <EstudianteDashboard /> },

          // solo para imprimir
          { path: '/estudiante/nueva-impresion', element: <MisImpresionesPage /> },

          //{ path: '/estudiante/mis-cursos', element: <MisCursosPage /> },  #PARA EL FUTURO
          //{ path: '/estudiante/mis-ayudantias', element: <MisAyudantiasPage /> }, #PARA EL FUTURO
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['PROFESOR']} />,
        children: [
          { path: ROUTES.PROFESOR.path, element: <ProfesorDashboard /> },
          { path: '/profesor/nuevo-curso', element: <CrearCurso /> },
          { path: '/profesor/cursos/:idCurso', element: <CursoDetallePage /> },
        ],
      },
    ],
  },
]);
