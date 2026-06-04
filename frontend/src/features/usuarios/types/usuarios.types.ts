export interface Usuario {
  idUsuario: string;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  usuarioRol: 'ESTUDIANTE' | 'PROFESOR' | 'AYUDANTE';
  borradoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}
