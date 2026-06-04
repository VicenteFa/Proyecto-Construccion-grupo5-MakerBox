import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Prisma, Usuario } from '@prisma/client';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id') //
  async obtenerUsuario(@Param('id') id: string): Promise<Omit<Usuario, 'passUsuario'>> {
    return this.usuariosService.obtenerUsuario(id);
  }

  @Post()
  async crearUsuario(
    @Body() data: Prisma.UsuarioCreateInput,
  ): Promise<Omit<Usuario, 'passUsuario'>> {
    return this.usuariosService.agregarUsuario(data);
  }
}
