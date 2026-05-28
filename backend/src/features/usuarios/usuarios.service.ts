import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, Usuario } from '../../generated/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async obtenerUsuario(id: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    return usuario;
  }

  /**
   *
   * @param data
   * @returns {Promise<Usuario>} El usuario creado, funciona como magia
   */
  async agregarUsuario(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    const nuevoUsuario = await this.prisma.usuario.create({
      data,
    });
    return nuevoUsuario;
  }
}
