import { useState } from 'react';
import { impresionesService } from '../services/impresiones.service';
import { message } from 'antd';

// Hook personalizado para manejar la logica de las impresiones 3D
export const useImpresiones = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Funcion para enviar la solicitud de impresion 3D al backend
  const enviarSolicitud = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Llamada al servicio para crear la solicitud de impresion
      await impresionesService.crearSolicitud(formData);
      message.success('¡Solicitud enviada con éxito!');
      return true;
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error(error);
      message.error('Ocurrió un error al enviar la solicitud.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { enviarSolicitud, isSubmitting };
};
