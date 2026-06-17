import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

const mockPrismaService = {
  usuario: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsuariosService (Pruebas unitarias)', () => {
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('obtenerUsuario', () => {
    it('debe retornar usuario sin passUsuario', async () => {
      const usuarioMock = {
        idUsuario: 'uuid-vicente-123',
        rut: '20123456-K',
        nombre: 'Vicente',
        apellido: 'Farias',
        correo: 'vfarias@utalca.cl',
        passUsuario: 'hash-secreto-super-seguro',
        usuarioRol: 'ESTUDIANTE',
        borradoEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      mockPrismaService.usuario.findUnique.mockResolvedValue(usuarioMock);

      const resultado = await service.obtenerUsuario('uuid-vicente-123');

      expect(resultado).toBeDefined();
      expect(resultado).not.toHaveProperty('passUsuario');
      expect(resultado.idUsuario).toBe('uuid-vicente-123');
      expect(resultado.nombre).toBe('Vicente');
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.obtenerUsuario('uuid-000')).rejects.toThrow(NotFoundException);
    });
  });

  describe('agregarUsuario', () => {
    const datosUsuario = {
      rut: '21987654-3',
      nombre: 'Carlos',
      apellido: 'Montecinos',
      correo: 'carMonte@utalca.cl',
      passUsuario: 'passwordMakerBox2026',
      usuarioRol: 'ESTUDIANTE' as const,
    };

    it('debe crear usuario y retornar sin passUsuario', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValue(null);
      mockPrismaService.usuario.create.mockResolvedValue({
        idUsuario: 'uuid-carlos-456',
        ...datosUsuario,
        borradoEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      });

      const resultado = await service.agregarUsuario(datosUsuario);

      expect(resultado).toBeDefined();
      expect(resultado).not.toHaveProperty('passUsuario');
      expect(resultado.correo).toBe(datosUsuario.correo);
    });

    it('debe lanzar ConflictException si el RUT ya existe', async () => {
      mockPrismaService.usuario.findFirst.mockResolvedValueOnce({
        idUsuario: 'uuid-existente',
        rut: datosUsuario.rut,
      });

      await expect(service.agregarUsuario(datosUsuario)).rejects.toThrow(ConflictException);

      expect(mockPrismaService.usuario.create).not.toHaveBeenCalled();
    });

    it('debe lanzar ConflictException si el correo ya existe', async () => {
      mockPrismaService.usuario.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ idUsuario: 'uuid-existente', correo: datosUsuario.correo });

      await expect(service.agregarUsuario(datosUsuario)).rejects.toThrow(ConflictException);

      expect(mockPrismaService.usuario.create).not.toHaveBeenCalled();
    });
  });
});
