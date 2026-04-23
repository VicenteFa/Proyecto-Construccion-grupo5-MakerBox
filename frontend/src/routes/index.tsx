import { createBrowserRouter } from 'react-router';
import { Home } from '../features/home/components/Home';
import { Login } from '../features/login/components/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
