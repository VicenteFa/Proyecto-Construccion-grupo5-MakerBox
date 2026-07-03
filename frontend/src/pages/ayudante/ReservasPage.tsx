import React, { useState, useEffect } from 'react';
import { SolicitudCard } from '../../shared/components/CardImpresion';
import type { EstadoSolicitud, IImpresion } from '../../constants/IImpresion';
import { ModalDetalles } from '../../shared/components/ModalImpresion';
import {
  obtenerTodasLasImpresiones,
  actualizarEstadoImpresionDB,
} from '../../services/getImpresiones';

const ModalDetallesAny = ModalDetalles as React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: IImpresion | null;
  onActualizar: (id: string, estado: EstadoSolicitud, observacion: string, tiempo: string) => void;
}>;

export const ReservasPage: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<IImpresion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Agregamos estado para manejar errores

  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<IImpresion | null>(null);

  const manejarAbrirModal = (solicitud: IImpresion) => {
    setSolicitudSeleccionada(solicitud);
    setModalAbierto(true);
  };

  const manejarCerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const manejarActualizacionSolicitud = async (
    idImpresion: string,
    nuevoEstado: EstadoSolicitud,
    nuevaObservacion: string,
    nuevoTiempo: string,
  ) => {
    try {
      await fetch(`http://localhost:3000/api/impresiones/${idImpresion}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          observacionAyudante: nuevaObservacion,
          tiempoEstimadoImpresion: nuevoTiempo,
        }),
      });
      await actualizarEstadoImpresionDB(idImpresion, nuevoEstado, nuevaObservacion);

      setSolicitudes((solicitudesAnteriores) =>
        solicitudesAnteriores.map((solicitud) =>
          solicitud.idImpresion === idImpresion
            ? {
                ...solicitud,
                estado: nuevoEstado,
                observacionAyudante: nuevaObservacion,
                tiempoEstimadoImpresion: nuevoTiempo,
              }
            : solicitud,
        ),
      );

      // Mostrar una alerta de exito
      console.log('¡Solicitud actualizada con éxito!');
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        // Iniciamos la carga
        setCargando(true);
        setError(null);

        // Llamamos al archivo de servicio externo
        const datos = await obtenerTodasLasImpresiones();

        // Guardamos los datos reales en el estado
        setSolicitudes(datos);
      } catch (error) {
        // Si el servidor falla, guardamos el error para mostrarlo en pantalla
        console.error('Error al cargar las solicitudes:', error);
        setError('No se pudieron cargar las solicitudes. Intente más tarde.');
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitudes();
  }, []);

  // Renderizado condicional si hay error
  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando solicitudes...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '40px' }}>Gestor de Impresiones 3D</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <SolicitudCard
              key={solicitud.idImpresion}
              data={solicitud}
              onAbrirModal={manejarAbrirModal}
            />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No hay solicitudes registradas.
          </p>
        )}
      </div>

      {modalAbierto && solicitudSeleccionada && (
        <ModalDetallesAny
          isOpen={modalAbierto}
          onClose={manejarCerrarModal}
          data={solicitudSeleccionada}
          onActualizar={manejarActualizacionSolicitud}
        />
      )}
    </div>
  );
};
