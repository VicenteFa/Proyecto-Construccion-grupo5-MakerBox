import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// Componente para proteger rutas segun el rol del usuario
interface Props {
  allowedRoles: string[];
}
// Componente que verifica si el usuario tiene un token valido y el rol permitido para acceder a la ruta
export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let rol = '';
  try {
    // Decodifica el token para obtener el rol del usuario
    const payload = jwtDecode<{ rol: string }>(token);
    rol = payload.rol;
  } catch {
    // Si el token no es valido, se elimina y se redirige al login
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
