import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  correo: string;
  rol: string;
  nombre?: string;
}

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

const getUsuarioFromToken = (token: string) => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

const tokenGuardado = localStorage.getItem('token');

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
