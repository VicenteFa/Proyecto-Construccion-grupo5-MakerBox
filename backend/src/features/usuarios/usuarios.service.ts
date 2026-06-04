import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    console.log('Usuario obtenido:', passUsuario); // Verificar que la contraseña se ha obtenido correctamente

    return usuarioSeguro;
  }

  async agregarUsuario(data: Prisma.UsuarioCreateInput): Promise<Omit<Usuario, 'passUsuario'>> {
    // Validar RUT duplicado
    const rutOcupado = await this.prisma.usuario.findFirst({
      where: { rut: data.rut },
    });
    if (rutOcupado) {
      throw new ConflictException('Este RUT ya se encuentra registrado en el sistema.');
    }

    // Validar Correo duplicado
    const correoOcupado = await this.prisma.usuario.findFirst({
      where: { correo: data.correo },
    });
    if (correoOcupado) {
      throw new ConflictException('Este correo electrónico ya está en uso.');
    }

    // Crear usuario si todas las validaciones pasaron
    const nuevoUsuario = await this.prisma.usuario.create({ data });
    const { passUsuario, ...usuarioSeguro } = nuevoUsuario;
    console.log('Usuario creado:', passUsuario); // Verificar que la contraseña se ha creado correctamente

    return usuarioSeguro;
  }
}
