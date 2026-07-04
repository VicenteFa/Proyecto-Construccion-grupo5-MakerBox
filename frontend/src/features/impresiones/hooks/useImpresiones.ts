import { useState, useEffect } from 'react';
import { impresionesService } from '../services/impresiones.service';
import { message } from 'antd';

interface Impresion {
  idImpresion: string;
  estado: 'PENDIENTE' | 'IMPRIMIENDO' | 'FINALIZADA' | 'RECHAZADA';
  colorOpcion1: string;
  colorOpcion2: string;
  colorOpcion3: string;
  comentario: string;
  creadoEn: string;
  observacionAyudante?: string;
  motivoRechazo?: string;
}

export const useImpresiones = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [impresiones, setImpresiones] = useState<Impresion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const obtenerMisImpresiones = async () => {
    setIsLoading(true);
    try {
      const data = await impresionesService.obtenerMisImpresiones();

      // Detectar estados nuevos comparando con localStorage
      const estadosGuardados: Record<string, string> = JSON.parse(
        localStorage.getItem('estadosImpresiones') || '{}',
      );

      const conNotificacion = data.map((imp: Impresion) => {
        const estadoAnterior = estadosGuardados[imp.idImpresion];
        const esNuevo = estadoAnterior && estadoAnterior !== imp.estado;
        return { ...imp, esNuevo };
      });

      // Guardar estados actuales en localStorage
      const nuevosEstados: Record<string, string> = {};
      data.forEach((imp: Impresion) => {
        nuevosEstados[imp.idImpresion] = imp.estado;
      });
      localStorage.setItem('estadosImpresiones', JSON.stringify(nuevosEstados));

      setImpresiones(conNotificacion);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener las impresiones.');
    } finally {
      setIsLoading(false);
    }
  };

  const enviarSolicitud = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await impresionesService.crearSolicitud(formData);
      message.success('¡Solicitud enviada con éxito!');
      return true;
    } catch (error) {
      console.error(error);
      message.error('Ocurrió un error al enviar la solicitud.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    obtenerMisImpresiones();
  }, []);

  return { enviarSolicitud, isSubmitting, impresiones, isLoading, obtenerMisImpresiones };
};
