export type EstadoSolicitud = 'PENDIENTE' | 'IMPRIMIENDO' | 'FINALIZADA' | 'RECHAZADA';

export interface IImpresion {
  idImpresion: string;
  solicitanteNombre: string;
  solicitanteApellido: string;
  solicitanteCorreo: string;
  solicitanteRut: string;
  refEstudiante: string;
  refAyudante: string;
  tipoUsuario: string;
  tipoSolicitud: string;
  nombreCurso: string;
  refCurso: string;
  colorOpcion1: string;
  colorOpcion2: string;
  colorOpcion3: string;
  comentarioTecnico: string;
  urlModelo3d: string;
  urlModeloStl: string;
  comentario: string;
  estado: EstadoSolicitud;
  observacionAyudante: string;
  motivoRechazo: string;
  tiempoEstimadoImpresion: string;
  inicioImpresion: Date | null;
  creadoEn: Date;
}
