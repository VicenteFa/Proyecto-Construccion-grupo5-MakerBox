import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './cursos.dto';
import { TipoRol } from '@prisma/client';
import { AuthRolesGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';

import type { RequestConUsuario } from '../auth/auth.guard';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @UseGuards(AuthRolesGuard)
  @Roles(TipoRol.PROFESOR)
  @Post()
  crearCurso(@Body() dto: CrearCursoDto, @Req() req: RequestConUsuario) {
    const idProfesor = req.user!.id;

    return this.cursosService.crearCurso(idProfesor, dto);
  }
}
