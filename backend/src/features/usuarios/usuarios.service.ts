import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Usuario } from '../../generated/prisma';

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
}
