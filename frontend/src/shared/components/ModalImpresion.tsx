import React from 'react';
import type { IImpresion } from '../../constants/IImpresion';
import '../../assets/styles/ModalImpresionStyles.css';

interface ModalDetallesProps {
  isOpen: boolean;
  onClose: () => void;
  data: IImpresion | null;
}

export const ModalDetalles: React.FC<ModalDetallesProps> = ({ isOpen, onClose, data }) => {
  // Si no está abierto o no hay datos, no renderiza nada
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h2 className="modal-titulo">Detalles de la Solicitud</h2>
          <button onClick={onClose} className="modal-boton-cerrar">
            &times;
          </button>
        </div>

        <div className="modal-cuerpo">
          <div className="modal-caja-gris">
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

          <div className="modal-enlaces-contenedor">
            <a href={data.urlModelo3d} target="_blank" rel="noreferrer" className="modal-enlace">
              Ver Modelo 3D
            </a>
            <a href={data.urlModeloStl} target="_blank" rel="noreferrer" className="modal-enlace">
              Descargar STL
            </a>
          </div>

          {data.observacionAyudante && (
            <div className="modal-caja-gris">
              <strong>Observación Ayudante:</strong> <br />
              {data.observacionAyudante}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
