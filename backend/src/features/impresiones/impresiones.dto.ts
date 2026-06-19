import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CrearImpresionDto {
  @IsString()
  solicitanteNombre!: string;

  @IsString()
  solicitanteApellido!: string;

  @IsEmail()
  solicitanteCorreo!: string;

  @IsString()
  solicitanteRut!: string;

  @IsString()
  tipoUsuario!: string;

  @IsString()
  tipoSolicitud!: string;

  @IsOptional()
  @IsString()
  nombreCurso?: string;

  @IsOptional()
  @IsString()
  refCurso?: string;

  @IsString()
  colorOpcion1!: string;

  @IsString()
  colorOpcion2!: string;

  @IsString()
  colorOpcion3!: string;

  @IsString()
  comentario?: string;
}
