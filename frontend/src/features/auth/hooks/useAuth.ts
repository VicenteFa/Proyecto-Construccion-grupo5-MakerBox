import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';

// Custom hook para manejar la autenticación
export const useAuth = () => {
  const { setToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Funcion para iniciar sesión
  const login = async (correo: string, passUsuario: string) => {
    setLoading(true);
    setError(null);
    try {
      // Llamada al servicio de autenticación para obtener el token
      const { token } = await authService.login({ correo, passUsuario });
      setToken(token);
      return true;
    } catch {
      // Si ocurre un error, se establece un mensaje de error
      setError('Credenciales introducidas incorrectas');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Funcion para registrar un nuevo usuario
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
      // Llamada al servicio de autenticacion para registrar un nuevo usuario
      await authService.register(data);
      return true;
    } catch {
      // Si ocurre un error, se establece un mensaje de error
      setError('Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error };
};
