import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

// Definicion de la interfaz para el payload del JWT
interface JwtPayload {
  id: string;
  correo: string;
  rol: string;
  nombre?: string;
}

// D}Efinicion de la interfaz para el estado de autenticacion
interface AuthState {
  token: string | null;
  usuario: {
    id: string;
    correo: string;
    rol: string;
    nombre?: string;
  } | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUsuario: (usuario: AuthState['usuario']) => void;
  logout: () => void;
}

// Funcion para decodificar el token y obtener la informacion del usuario
const getUsuarioFromToken = (token: string) => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

// Obtener el token del localStorage al cargar la aplicacion
const tokenGuardado = localStorage.getItem('token');

// Crear el store de autenticacion usando Zustand
export const useAuthStore = create<AuthState>((set) => ({
  token: tokenGuardado,
  usuario: tokenGuardado ? getUsuarioFromToken(tokenGuardado) : null,
  isAuthenticated: !!tokenGuardado,
  setToken: (token) => {
    localStorage.setItem('token', token);
    const usuario = getUsuarioFromToken(token);
    set({ token, usuario, isAuthenticated: true });
  },
  setUsuario: (usuario) => set({ usuario }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, usuario: null, isAuthenticated: false });
  },
}));
