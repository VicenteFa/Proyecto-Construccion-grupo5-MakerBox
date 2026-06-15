export const ROUTES = {
  HOME: { path: '/', text: 'Home', isVisible: true },
  LOGIN: { path: '/login', text: 'Login', isVisible: true },
  SIGN_UP: { path: '/signup', text: 'Sign Up', isVisible: true },
  ADMIN: { path: '/admin', text: 'Admin', isVisible: false },
  AYUDANTE: { path: '/ayudante', text: 'Ayudante', isVisible: false },
  PROFESOR: { path: '/profesor', text: 'Profesor', isVisible: false },
  ESTUDIANTE: { path: '/estudiante', text: 'Estudiante', isVisible: false },
} as const;
