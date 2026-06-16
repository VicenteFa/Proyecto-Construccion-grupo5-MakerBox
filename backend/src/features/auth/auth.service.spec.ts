import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  usuario: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Registro de un estudiante
  describe('registrarEstudiante', () => {
    const datosRegistro = {
      rut: '11111111-1',
      nombre: 'Carlos',
      apellido: 'Montecinos',
      correo: 'carMonte@utalca.cl',
      passUsuario: '123456',
    };

    it('Registro de un estudiante exitosamente', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValue(null);
      mockPrismaService.usuario.create.mockResolvedValue({
        idUsuario: '0bda-44de',
        rut: datosRegistro.rut,
        nombre: datosRegistro.nombre,
        apellido: datosRegistro.apellido,
        correo: datosRegistro.correo,
        usuarioRol: 'ESTUDIANTE',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      });

      const resultado = await service.registrarEstudiante(datosRegistro);

      expect(resultado).toBeDefined();
      expect(resultado.correo).toBe(datosRegistro.correo);
      expect(mockPrismaService.usuario.create).toHaveBeenCalledTimes(1);
    });

    it('Registro de un estudiante fallido si el correo o RUT ya existen', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValue({
        idUsuario: 'id-existente',
        correo: datosRegistro.correo,
      });

      await expect(service.registrarEstudiante(datosRegistro)).rejects.toThrow(ConflictException);

      expect(mockPrismaService.usuario.create).not.toHaveBeenCalled();
    });
    // Verificar que la contraseña se hashea antes de guardarla
    it('Hashear la contraseña antes de guardarla', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValue(null);
      mockPrismaService.usuario.create.mockResolvedValue({
        idUsuario: '0bda-44de',
        correo: datosRegistro.correo,
        usuarioRol: 'ESTUDIANTE',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      });
      // Espiar la función bcrypt.hash para verificar que se llama con la contraseña y el salt rounds
      await service.registrarEstudiante(datosRegistro);

      // Verificamos que la contraseña guardada es un hash valido de bcrypt
      const createMock = mockPrismaService.usuario.create;

      const dataGuardada = (createMock.mock.calls[0] as Array<{ data: { passUsuario: string } }>)[0]
        .data;
      const esHashValido = await bcrypt.compare(
        datosRegistro.passUsuario,
        dataGuardada.passUsuario,
      );
      expect(esHashValido).toBe(true);
    });
  });

  // Login de un usuario
  describe('login', () => {
    const datosLogin = {
      correo: 'carMonte@utalca.cl',
      passUsuario: '123456',
    };

    it('Retornar token JWT si las credenciales son correctas', async () => {
      const passwordHasheada = await bcrypt.hash(datosLogin.passUsuario, 10);

      mockPrismaService.usuario.findFirst.mockResolvedValue({
        idUsuario: '0bda-44de',
        correo: datosLogin.correo,
        passUsuario: passwordHasheada,
        usuarioRol: 'ESTUDIANTE',
      });

      const resultado = await service.login(datosLogin);

      expect(resultado).toBeDefined();
      expect(resultado.token).toBeDefined();
      expect(typeof resultado.token).toBe('string');
    });

    it('Lanzar UnauthorizedException si el usuario no existe', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValue(null);

      await expect(service.login(datosLogin)).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const passwordHasheada = await bcrypt.hash('otraPassword', 10);

      mockPrismaService.usuario.findFirst.mockResolvedValue({
        idUsuario: '0bda-44de',
        correo: datosLogin.correo,
        passUsuario: passwordHasheada,
        usuarioRol: 'ESTUDIANTE',
      });

      await expect(service.login(datosLogin)).rejects.toThrow(UnauthorizedException);
    });
  });
});
