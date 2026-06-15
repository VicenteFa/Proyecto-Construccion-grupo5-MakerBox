// Importamos la instancia de Axios configurada para realizar las solicitudes HTTP al backend
import axiosInstance from '../../../shared/lib/axios';

// DTOs (Data Transfer Objects) para las solicitudes de autenticación
interface LoginDto {
  correo: string;
  passUsuario: string;
}
// DTO para el registro de usuario
interface RegistroDto {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  passUsuario: string;
}
// servicio de autentificacion que se encarga de manejar las solicitudes  de login y registro
export const authService = {
  login: async (data: LoginDto) => {
    const response = await axiosInstance.post<{ token: string }>('/auth/login', data);
    return response.data;
  },
  // registro de usuario, envia los datos del nuevo usuario al backend para crear una nueva cuenta
  register: async (data: RegistroDto) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
};
