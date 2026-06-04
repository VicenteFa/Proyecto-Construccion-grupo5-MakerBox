import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async obtenerUsuario(id: string): Promise<Omit<Usuario, 'passUsuario'>> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    const { passUsuario, ...usuarioSeguro } = usuario;

    return usuarioSeguro;
  }

  async agregarUsuario(data: Prisma.UsuarioCreateInput): Promise<Omit<Usuario, 'passUsuario'>> {
    const nuevoUsuario = await this.prisma.usuario.create({ data });
    const { passUsuario, ...usuarioSeguro } = nuevoUsuario;
    return usuarioSeguro;
  }
}
