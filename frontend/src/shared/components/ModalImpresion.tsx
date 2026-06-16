import React from 'react';
import type { IImpresion } from '../../constants/IImpresion';

interface ModalDetallesProps {
  isOpen: boolean;
  onClose: () => void;
  data: IImpresion | null;
}

export const ModalDetalles: React.FC<ModalDetallesProps> = ({ isOpen, onClose, data }) => {
  // Si no está abierto o no hay datos, no renderiza nada
  if (!isOpen || !data) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
            paddingBottom: '12px',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>Detalles de la Solicitud</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ display: 'grid', gap: '12px', color: '#374151' }}>
          <div
            style={{
              backgroundColor: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px',
            }}
          >
            <p>
              <strong>Solicitante:</strong> {data.solicitanteNombre} {data.solicitanteApellido}
            </p>
            <p>
              <strong>Correo:</strong> {data.solicitanteCorreo}
            </p>
            <p>
              <strong>RUT:</strong> {data.solicitanteRut}
            </p>
            <p>
              <strong>Curso:</strong> {data.nombreCurso}
            </p>
            <p>
              <strong>Colores preferidos:</strong> {data.colorOpcion1}, {data.colorOpcion2},{' '}
              {data.colorOpcion3}
            </p>
            <p>
              <strong>Comentario del usuario:</strong> {data.comentario}
            </p>
            <p>
              <strong>Comentario técnico:</strong> {data.comentarioTecnico}
            </p>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a
              href={data.urlModelo3d}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#3b82f6', marginRight: '16px' }}
            >
              Ver Modelo 3D
            </a>
            <a
              href={data.urlModeloStl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#3b82f6' }}
            >
              Descargar STL
            </a>
          </div>

          {data.observacionAyudante && (
            <div
              style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
              }}
            >
              <strong>Observación Ayudante:</strong> <br />
              {data.observacionAyudante}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
