import axios from 'axios';

export const axiosInstance = axios.create({
  // Si estamos en desarrollo usa localhost, si estamos en producción (Azure) usa solo "/api" para que se haga la peticion al mismo dominio
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
