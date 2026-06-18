import React from 'react';
import type { IImpresion, EstadoSolicitud } from '../../constants/IImpresion';
import '../../assets/styles/CardImpresionStyles.css';

interface SolicitudCardProps {
  data: IImpresion;
  onAbrirModal: (data: IImpresion) => void;
}

export const SolicitudCard: React.FC<SolicitudCardProps> = ({ data, onAbrirModal }) => {
  const getBadgeClassPorEstado = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge-pendiente';
      case 'IMPRIMIENDO':
        return 'badge-imprimiendo';
      case 'FINALIZADA':
        return 'badge-finalizada';
      case 'RECHAZADA':
        return 'badge-rechazada';
      default:
        return 'badge-default';
    }
  };

  const fechaFormateada = new Date(data.creadoEn).toLocaleDateString('es-CL');

  return (
    <div className="solicitud-card">
      <div className="solicitud-header">
        <h3 className="solicitud-nombre">
          {data.solicitanteNombre} {data.solicitanteApellido}
        </h3>
        <span className={`solicitud-badge ${getBadgeClassPorEstado(data.estado)}`}>
          {data.estado}
        </span>
      </div>

      <div className="solicitud-contenido">
        <p className="solicitud-texto">
          <strong>Tipo usuario:</strong> {data.tipoUsuario}
        </p>
        <p className="solicitud-texto">
          <strong>Curso:</strong> {data.nombreCurso}
        </p>
        <p className="solicitud-texto">
          <strong>Tipo:</strong> {data.tipoSolicitud}
        </p>
        <p className="solicitud-texto">
          <strong>Fecha solicitud:</strong> {fechaFormateada}
        </p>

        {data.urlModelo3d && (
          <p className="solicitud-texto">
            <strong>URL modelo 3D:</strong>{' '}
            <a
              href={data.urlModelo3d}
              target="_blank"
              rel="noopener noreferrer"
              className="solicitud-enlace"
            >
              {data.urlModelo3d}
            </a>
          </p>
        )}

        {data.urlModeloStl && (
          <p className="solicitud-texto">
            <strong>URL STL:</strong>{' '}
            <a
              href={data.urlModeloStl}
              target="_blank"
              rel="noopener noreferrer"
              className="solicitud-enlace"
            >
              {data.urlModeloStl}
            </a>
          </p>
        )}

        {data.tiempoEstimadoImpresion && (
          <p className="solicitud-texto">
            <strong>Tiempo est.:</strong> {data.tiempoEstimadoImpresion}
          </p>
        )}
      </div>

      <button onClick={() => onAbrirModal(data)} className="solicitud-boton">
        Ver todos los detalles
      </button>
    </div>
  );
};
