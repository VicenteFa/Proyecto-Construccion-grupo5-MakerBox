import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Prisma, Usuario } from '../../generated/client';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crearUsuario(@Body() data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return this.usuariosService.agregarUsuario(data);
  }
}
