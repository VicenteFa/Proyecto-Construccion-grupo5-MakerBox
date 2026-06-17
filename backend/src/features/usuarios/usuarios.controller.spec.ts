import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

const mockUsuariosService = {
  obtenerUsuario: jest.fn(),
  agregarUsuario: jest.fn(),
};

describe('UsuariosController', () => {
  let controller: UsuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: mockUsuariosService }],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  afterEach(() => jest.clearAllMocks());

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerUsuario', () => {
    it('debe retornar un usuario por ID', async () => {
      const usuarioMock = {
        idUsuario: 'uuid-vicente-123',
        rut: '20123456-K',
        nombre: 'Vicente',
        apellido: 'Farias',
        correo: 'vfarias@utalca.cl',
        usuarioRol: 'ESTUDIANTE' as const,
        borradoEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      mockUsuariosService.obtenerUsuario.mockResolvedValue(usuarioMock);

      const resultado = await controller.obtenerUsuario('uuid-vicente-123');

      expect(resultado).toEqual(usuarioMock);
      expect(mockUsuariosService.obtenerUsuario).toHaveBeenCalledWith('uuid-vicente-123');
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockUsuariosService.obtenerUsuario.mockRejectedValue(
        new NotFoundException('El usuario con ID uuid-000 no existe'),
      );

      await expect(controller.obtenerUsuario('uuid-000')).rejects.toThrow(NotFoundException);
    });
  });

  describe('crearUsuario', () => {
    it('debe crear un usuario exitosamente', async () => {
      const dto = {
        rut: '21987654-3',
        nombre: 'Carlos',
        apellido: 'Montecinos',
        correo: 'carMonte@utalca.cl',
        passUsuario: 'passwordMakerBox2026',
        usuarioRol: 'ESTUDIANTE' as const,
      };
      const usuarioCreado = {
        idUsuario: 'uuid-carlos-456',
        rut: dto.rut,
        nombre: dto.nombre,
        apellido: dto.apellido,
        correo: dto.correo,
        usuarioRol: dto.usuarioRol,
        borradoEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      mockUsuariosService.agregarUsuario.mockResolvedValue(usuarioCreado);

      const resultado = await controller.crearUsuario(dto);

      expect(resultado).toEqual(usuarioCreado);
      expect(mockUsuariosService.agregarUsuario).toHaveBeenCalledWith(dto);
    });
  });
});
