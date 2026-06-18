import React, { useState } from 'react';
import type { IImpresion, EstadoSolicitud } from '../../constants/IImpresion';
import '../../assets/styles/ModalImpresionStyles.css';

interface ModalDetallesProps {
  isOpen: boolean;
  onClose: () => void;
  data: IImpresion | null;
  // Nueva función que recibe el ID, el nuevo estado y el nuevo comentario
  onActualizar: (idImpresion: string, estado: EstadoSolicitud, observacion: string) => void;
}

export const ModalDetalles: React.FC<ModalDetallesProps> = ({
  isOpen,
  onClose,
  data,
  onActualizar,
}) => {
  const [estadoEditado, setEstadoEditado] = useState<EstadoSolicitud>(data?.estado ?? 'PENDIENTE');
  const [observacionEditada, setObservacionEditada] = useState<string>(
    data?.observacionAyudante || '',
  );
  console.log('Datos de la solicitud:', data);

  if (!isOpen || !data) return null;

  const manejarGuardar = () => {
    onActualizar(data.idImpresion, estadoEditado, observacionEditada);
    onClose(); // Cerramos el modal después de guardar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h2 className="modal-titulo">Gestión de Solicitud</h2>
          <button onClick={onClose} className="modal-boton-cerrar">
            &times;
          </button>
        </div>

        <div className="modal-cuerpo">
          {/* Información de solo lectura */}
          <div className="modal-caja-gris">
            <p>
              <strong>Solicitante:</strong> {data.solicitanteNombre} {data.solicitanteApellido}
            </p>
            <p>
              <strong>Curso:</strong> {data.nombreCurso}
            </p>
            <p>
              <strong>Archivos:</strong>{' '}
              <a href={data.urlModelo3d} target="_blank" rel="noreferrer" className="modal-enlace">
                3D
              </a>{' '}
              |{' '}
              <a href={data.urlModeloStl} target="_blank" rel="noreferrer" className="modal-enlace">
                STL
              </a>
            </p>
          </div>

          {/* Zona de Edición para el Ayudante */}
          <div className="modal-acciones-contenedor">
            <h3 className="modal-acciones-titulo">Acciones del Ayudante</h3>

            {/* Selector de Estado */}
            <div>
              <label className="modal-label">Actualizar Estado:</label>
              <select
                value={estadoEditado}
                onChange={(e) => setEstadoEditado(e.target.value as EstadoSolicitud)}
                className="modal-input"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="IMPRIMIENDO">Imprimiendo</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>

            {/* Comentario del Ayudante */}
            <div>
              <label className="modal-label">Observación / Motivo:</label>
              <textarea
                value={observacionEditada}
                onChange={(e) => setObservacionEditada(e.target.value)}
                placeholder="Escribe aquí si hay algún problema con la malla, o si está lista para retirar..."
                rows={4}
                /* Unimos las clases con un espacio para heredar el estilo general de input y agregar el resize */
                className="modal-input modal-textarea"
              />
            </div>

            {/* Botón Guardar */}
            <button onClick={manejarGuardar} className="modal-boton-guardar">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
