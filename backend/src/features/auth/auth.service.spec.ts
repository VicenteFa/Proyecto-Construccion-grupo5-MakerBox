import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { TipoRol, Usuario } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('registrarProfesor', () => {
    const mockDto = {
      rut: '11222333-4',
      nombre: 'Test',
      apellido: 'Profesor',
      correo: 'test@universidad.cl',
      passUsuario: '123456',
    };

    it('debería crear un profesor exitosamente', async () => {
      jest.spyOn(prisma.usuario, 'findFirst').mockResolvedValue(null);

      const createSpy = jest.spyOn(prisma.usuario, 'create').mockResolvedValue({
        idUsuario: 'uuid-123',
        ...mockDto,
        usuarioRol: TipoRol.PROFESOR,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        borradoEn: null,
      } as Usuario);

      const resultado = await service.registrarProfesor(mockDto);

      expect(resultado).toBeDefined();
      expect(resultado.usuarioRol).toBe(TipoRol.PROFESOR);
      expect(createSpy).toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el correo o RUT ya existen', async () => {
      jest
        .spyOn(prisma.usuario, 'findFirst')
        .mockResolvedValue({ idUsuario: 'uuid-existente' } as Usuario);

      await expect(service.registrarProfesor(mockDto)).rejects.toThrow(ConflictException);
    });
  });
});
