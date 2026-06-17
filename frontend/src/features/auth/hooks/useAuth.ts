import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
// Este hook es el que se usa en toda la app para manejar la autenticacion. Provee login, register, logout, y el estado de autenticacion.
export const useAuth = () => {
  const { setToken, logout, isAuthenticated, usuario } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // El login y register son funciones asincronas que manejan el estado de loading y error, y actualizan el token en el store de  auth
  const login = async (correo: string, passUsuario: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await authService.login({ correo, passUsuario });
      setToken(token);
      return true;
    } catch {
      // Si el login falla, se dice un mensaje de error
      setError('Credenciales introducidas incorrectas');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // El register es similar al login, pero no actualiza el token. Devuelve true si el registro fue exitoso, o false si hubo un error.
  const register = async (data: {
    rut: string;
    nombre: string;
    apellido: string;
    correo: string;
    passUsuario: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data); // Si el registro es exitoso, se devuelve true. El usuario debe loguearse despues de registrarse.
      return true;
    } catch {
      setError('Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error, isAuthenticated, usuario };
};
