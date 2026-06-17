import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  registrarEstudiante: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debe registrar un estudiante exitosamente', async () => {
      const dto = {
        rut: '20123456-K',
        nombre: 'Vicente',
        apellido: 'Farias',
        correo: 'vfarias@utalca.cl',
        passUsuario: 'password123',
      };
      const resultado = {
        idUsuario: 'uuid-123',
        correo: dto.correo,
        usuarioRol: 'ESTUDIANTE',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      mockAuthService.registrarEstudiante.mockResolvedValue(resultado);

      const respuesta = await controller.register(dto);

      expect(respuesta).toEqual(resultado);
      expect(mockAuthService.registrarEstudiante).toHaveBeenCalledWith(dto);
    });

    it('debe lanzar ConflictException si el correo o RUT ya existen', async () => {
      const dto = {
        rut: '20123456-K',
        nombre: 'Vicente',
        apellido: 'Farias',
        correo: 'vfarias@utalca.cl',
        passUsuario: 'password123',
      };
      mockAuthService.registrarEstudiante.mockRejectedValue(
        new ConflictException('El correo o RUT ya existen'),
      );

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('debe retornar un token JWT si las credenciales son correctas', async () => {
      const dto = { correo: 'vfarias@utalca.cl', passUsuario: 'password123' };
      const resultado = { token: 'jwt-token-mock' };
      mockAuthService.login.mockResolvedValue(resultado);

      const respuesta = await controller.login(dto);

      expect(respuesta).toEqual(resultado);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('debe lanzar UnauthorizedException si las credenciales son incorrectas', async () => {
      const dto = { correo: 'vfarias@utalca.cl', passUsuario: 'wrongpassword' };
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Credenciales incorrectas'),
      );

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
