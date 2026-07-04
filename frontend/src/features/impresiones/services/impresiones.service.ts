import axiosInstance from '../../../shared/lib/axios';

export const impresionesService = {
  crearSolicitud: async (datosFormulario: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/impresiones', datosFormulario, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  obtenerMisImpresiones: async () => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/impresiones/mis-impresiones', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
