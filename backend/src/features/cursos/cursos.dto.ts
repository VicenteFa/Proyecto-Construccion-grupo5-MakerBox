import { IsString, IsNotEmpty } from 'class-validator';

export class CrearCursoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  refSemestre!: string;
}
