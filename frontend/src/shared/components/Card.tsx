import React from 'react';
import type { IImpresion, EstadoSolicitud } from '../../constants/IImpresion';

interface SolicitudCardProps {
  data: IImpresion;
}

export const SolicitudCard: React.FC<SolicitudCardProps> = ({ data }) => {
  // Función para asignar colores según el estado
  const getColorPorEstado = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'PENDIENTE':
        return '#f59e0b'; // Naranja
      case 'IMPRIMIENDO':
        return '#3b82f6'; // Azul
      case 'FINALIZADA':
        return '#10b981'; // Verde
      case 'RECHAZADA':
        return '#ef4444'; // Rojo
      default:
        return '#6b7280'; // Gris
    }
  };

  // Formatear la fecha para que sea legible
  const fechaFormateada = new Date(data.creadoEn).toLocaleDateString('es-CL');

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        width: '100%',
        maxWidth: '320px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Encabezado: Nombre y Estado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>
          {data.solicitanteNombre} {data.solicitanteApellido}
        </h3>
        <span
          style={{
            backgroundColor: getColorPorEstado(data.estado),
            color: 'white',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {data.estado}
        </span>
      </div>

      {/* Información Resumida */}
      <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>
        <p style={{ margin: '4px 0' }}>
          <strong>Tipo usuario:</strong> {data.tipoUsuario}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Curso:</strong> {data.nombreCurso}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Tipo:</strong> {data.tipoSolicitud}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Fecha solicitud:</strong> {fechaFormateada}
        </p>

        {data.urlModelo3d && (
          <p style={{ margin: '4px 0' }}>
            <strong>URL modelo 3D:</strong>{' '}
            <a
              href={data.urlModelo3d}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb' }}
            >
              {data.urlModelo3d}
            </a>
          </p>
        )}

        {data.urlModeloStl && (
          <p style={{ margin: '4px 0' }}>
            <strong>URL STL:</strong>{' '}
            <a
              href={data.urlModeloStl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb' }}
            >
              {data.urlModeloStl}
            </a>
          </p>
        )}

        {/* Renderizado condicional: Solo mostrar si hay tiempo estimado */}
        {data.tiempoEstimadoImpresion && (
          <p style={{ margin: '4px 0' }}>
            <strong>Tiempo est.:</strong> {data.tiempoEstimadoImpresion}
          </p>
        )}
      </div>

      {/* Botón de acción */}
      <button
        style={{
          marginTop: 'auto',
          padding: '10px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
      >
        Ver todos los detalles
      </button>
    </div>
  );
};
