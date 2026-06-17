import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TipoRol } from '@prisma/client';
import { RegistroDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registrarEstudiante(datosRegistro: RegistroDto) {
    const usuarioExistente = await this.prisma.usuario.findFirst({
      // verificar si el correo o el RUT existen
      where: {
        OR: [{ correo: datosRegistro.correo }, { rut: datosRegistro.rut }],
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo o RUT ya existen');
    }

    const saltos = 10;
    const passwordHasheada = await bcrypt.hash(datosRegistro.passUsuario, saltos); // Hash de la contraseña

    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        rut: datosRegistro.rut,
        nombre: datosRegistro.nombre,
        apellido: datosRegistro.apellido,
        correo: datosRegistro.correo,
        passUsuario: passwordHasheada,
        usuarioRol: TipoRol.ESTUDIANTE,
      },
      // Indicamos qu campos se retornan, excluyendo passUsuario
      select: {
        idUsuario: true,
        rut: true,
        nombre: true,
        apellido: true,
        correo: true,
        usuarioRol: true,
        creadoEn: true,
        actualizadoEn: true,
      },
    });

    return nuevoUsuario;
  }

  async login(datosLogin: LoginDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { correo: datosLogin.correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValida = await bcrypt.compare(datosLogin.passUsuario, usuario.passUsuario);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = jwt.sign(
      {
        id: usuario.idUsuario,
        correo: usuario.correo,
        rol: usuario.usuarioRol,
      },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: '8h' },
    );

    return { token };
  }

  async registrarProfesor(datosRegistro: RegistroDto) {
    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ correo: datosRegistro.correo }, { rut: datosRegistro.rut }],
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo o RUT ya existen');
    }

    const saltos = 10;
    const passwordHasheada = await bcrypt.hash(datosRegistro.passUsuario, saltos);

    const nuevoProfesor = await this.prisma.usuario.create({
      data: {
        rut: datosRegistro.rut,
        nombre: datosRegistro.nombre,
        apellido: datosRegistro.apellido,
        correo: datosRegistro.correo,
        passUsuario: passwordHasheada,
        usuarioRol: TipoRol.PROFESOR,
      },
      select: {
        idUsuario: true,
        rut: true,
        nombre: true,
        apellido: true,
        correo: true,
        usuarioRol: true,
        creadoEn: true,
        actualizadoEn: true,
      },
    });

    return nuevoProfesor;
  }
}
