import React, { useState, useEffect } from 'react';
import { SolicitudCard } from '../../shared/components/CardImpresion';
import type { IImpresion } from '../../constants/IImpresion';
import { ModalDetalles } from '../../shared/components/ModalImpresion';

// Importamos el servicio que acabamos de crear
import { obtenerTodasLasImpresiones } from '../../services/getImpresiones';

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
      <h1>Gestor de Impresiones 3D</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <SolicitudCard key={solicitud.id} data={solicitud} onAbrirModal={manejarAbrirModal} />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No hay solicitudes registradas.
          </p>
        )}
      </div>

      <ModalDetalles
        isOpen={modalAbierto}
        onClose={manejarCerrarModal}
        data={solicitudSeleccionada}
      />
    </div>
  );
};
