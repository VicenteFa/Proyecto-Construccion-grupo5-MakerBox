export const ROUTES = {
  HOME: { path: '/', text: 'Home', isVisible: true },
  LOGIN: { path: '/login', text: 'Login', isVisible: true },
  SIGN_UP: { path: '/signup', text: 'Sign Up', isVisible: true },
  ADMIN: { path: '/admin', text: 'Admin', isVisible: false },
  AYUDANTE: { path: '/ayudante', text: 'Ayudante', isVisible: false },
  SOLICITUD: { path: '/solicitud', text: 'Solicitud', isVisible: false },
  RESERVAS: { path: '/reservas', text: 'Reservas', isVisible: false },
  INVENTARIO: { path: '/inventory', text: 'Inventario', isVisible: false },
} as const;
