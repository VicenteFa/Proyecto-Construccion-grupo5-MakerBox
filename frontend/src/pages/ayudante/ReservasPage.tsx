import React, { useState, useEffect } from 'react';
import { SolicitudCard } from '../../shared/components/Card'; // Ajusta la ruta según tus carpetas
import type { IImpresion } from '../../constants/IImpresion'; // Ajusta la ruta de tu interfaz

export const ReservasPage: React.FC = () => {
  // Estado para guardar la lista de impresiones
  const [solicitudes, setSolicitudes] = useState<IImpresion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // useEffect simula la llamada a tu base de datos al cargar la página
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        // Aquí iría tu llamada real, por ejemplo:
        // const respuesta = await fetch('/api/solicitudes');
        // const datos = await respuesta.json();

        // --- INICIO DE DATOS SIMULADOS ---
        const datosSimulados: IImpresion[] = [
          {
            id: '1',
            solicitanteNombre: 'Juan',
            solicitanteApellido: 'Pérez',
            solicitanteCorreo: 'juan@correo.cl',
            solicitanteRut: '12345678-9',
            refEstudiante: 'EST-001',
            refAyudante: 'AYU-002',
            tipoUsuario: 'ALUMNO',
            tipoSolicitud: 'PROYECTO',
            nombreCurso: 'Diseño Industrial',
            refCurso: 'CUR-001',
            colorOpcion1: 'Negro',
            colorOpcion2: 'Blanco',
            colorOpcion3: 'Gris',
            comentarioTecnico: 'Relleno al 20%',
            urlModelo3d: 'https://link.com/3d',
            urlModeloStl: 'https://link.com/stl',
            comentario: 'Es para el proyecto final.',
            estado: 'PENDIENTE',
            observacionAyudante: '',
            motivoRechazo: '',
            tiempoEstimadoImpresion: '4 horas',
            inicioImpresion: null,
            creadoEn: new Date(),
          },
          {
            id: '2',
            solicitanteNombre: 'María',
            solicitanteApellido: 'González',
            solicitanteCorreo: 'maria@correo.cl',
            solicitanteRut: '9876543-2',
            refEstudiante: 'EST-002',
            refAyudante: 'AYU-002',
            tipoUsuario: 'ALUMNO',
            tipoSolicitud: 'PERSONAL',
            nombreCurso: 'Arquitectura',
            refCurso: 'CUR-005',
            colorOpcion1: 'Rojo',
            colorOpcion2: 'Azul',
            colorOpcion3: 'Transparente',
            comentarioTecnico: 'Usar soportes en árbol',
            urlModelo3d: 'https://link.com/3d-2',
            urlModeloStl: 'https://link.com/stl-2',
            comentario: 'Maqueta a escala.',
            estado: 'IMPRIMIENDO',
            observacionAyudante: 'Revisado, modelo correcto.',
            motivoRechazo: '',
            tiempoEstimadoImpresion: '12 horas',
            inicioImpresion: new Date(),
            creadoEn: new Date(Date.now() - 86400000), // Fecha de ayer
          },
        ];
        // --- FIN DE DATOS SIMULADOS ---

        setSolicitudes(datosSimulados);
      } catch (error) {
        console.error('Error al cargar las solicitudes:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  if (cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando solicitudes...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#1f2937' }}>Gestor de Impresiones 3D</h1>

      {/* Contenedor de las tarjetas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Hace que sea responsivo
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Aquí es donde ocurre la magia: recorremos el array y creamos una tarjeta por cada uno */}
        {solicitudes.map((solicitud) => (
          <SolicitudCard key={solicitud.id} data={solicitud} />
        ))}

        {/* Mensaje por si la base de datos está vacía */}
        {solicitudes.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
            No hay solicitudes registradas.
          </p>
        )}
      </div>
    </div>
  );
};
