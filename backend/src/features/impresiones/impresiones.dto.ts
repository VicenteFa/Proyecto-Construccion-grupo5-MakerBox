import { IsString } from 'class-validator';

export class CrearImpresionDto {
  @IsString()
  colorOpcion1!: string;

  @IsString()
  colorOpcion2!: string;

  @IsString()
  colorOpcion3!: string;

  @IsString()
  comentario!: string;
}
