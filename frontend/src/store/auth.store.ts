import { create } from 'zustand';

// Definimos la interfaz para el estado de autenticación
interface AuthState {
  token: string | null;
  usuario: {
    id: string;
    correo: string;
    rol: string;
  } | null;
  setToken: (token: string) => void;
  setUsuario: (usuario: AuthState['usuario']) => void;
  logout: () => void;
}
// Creamos el store de autenticacion usando Zustand
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  usuario: null,
  // Funcion para establecer el token de autenticacion
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  // establecer el usuario autenticado en el estado
  setUsuario: (usuario) => set({ usuario }),
  // FUncion para cerrar sesion, elimina el token del localStorage y resetea el estado de autenticacion
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, usuario: null });
  },
}));
