// features/usuarios/hooks/useUsuarios.ts
import { useState } from 'react';
import { usuariosService } from '../services/usuarios.service';
import type { Usuario } from '../types/usuarios.types';

export const useUsuarios = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerUsuario = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuariosService.obtenerUsuarioPorId(id);
      setUsuario(data);
    } catch (err) {
      setError('No se encontró el usuario');
    } finally {
      setLoading(false);
    }
  };

  return { usuario, loading, error, obtenerUsuario };
};
