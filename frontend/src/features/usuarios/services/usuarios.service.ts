import { axiosInstance } from '../../../shared/lib/axios';

import type { Usuario } from '../types/usuarios.types';

export const usuariosService = {
  obtenerUsuarioPorId: async (id: string): Promise<Usuario> => {
    const response = await axiosInstance.get(`/usuarios/${id}`);
    return response.data;
  },
};
