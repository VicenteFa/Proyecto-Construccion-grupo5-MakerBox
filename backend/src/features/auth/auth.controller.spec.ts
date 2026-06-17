import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { TipoRol, Usuario } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registrarEstudiante: jest.fn(),
            login: jest.fn(),
            registrarProfesor: jest.fn(), // Fundamental agregarlo aquí
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería llamar al servicio para registrar un profesor', async () => {
    const mockDto = {
      rut: '11222333-4',
      nombre: 'Test',
      apellido: 'Profesor',
      correo: 'test@universidad.cl',
      passUsuario: '123456',
    };

    const mockRespuesta = {
      idUsuario: 'uuid-123',
      rut: mockDto.rut,
      nombre: mockDto.nombre,
      apellido: mockDto.apellido,
      correo: mockDto.correo,
      usuarioRol: TipoRol.PROFESOR,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    } as Usuario;

    const registrarProfesorSpy = jest
      .spyOn(service, 'registrarProfesor')
      .mockResolvedValue(mockRespuesta);

    const resultado = await controller.registrarProfesor(mockDto);

    expect(resultado).toEqual(mockRespuesta);
    expect(registrarProfesorSpy).toHaveBeenCalledWith(mockDto);
  });
});
