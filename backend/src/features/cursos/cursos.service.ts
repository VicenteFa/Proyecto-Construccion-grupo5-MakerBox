import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CrearCursoDto } from './cursos.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async crearCurso(idProfesor: string, dto: CrearCursoDto) {
    const nuevoCurso = await this.prisma.curso.create({
      data: {
        nombre: dto.nombre,
        refSemestre: dto.refSemestre,
        refProfesor: idProfesor, // Este ID viene blindado desde el token JWT
      },
    });

    return nuevoCurso;
  }
}
