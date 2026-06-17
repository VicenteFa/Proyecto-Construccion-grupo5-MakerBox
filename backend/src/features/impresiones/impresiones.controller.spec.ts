import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ImpresionesController } from './impresiones.controller';
import { ImpresionesService } from './impresiones.service';
import { EstadoImpresion } from '@prisma/client';
import type { RequestConUsuario } from '../../shared/guards/auth.guard';

const mockImpresionesService = {
  crearImpresion: jest.fn(),
  cambiarEstado: jest.fn(),
};

describe('ImpresionesController', () => {
  let controller: ImpresionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImpresionesController],
      providers: [{ provide: ImpresionesService, useValue: mockImpresionesService }],
    }).compile();

    controller = module.get<ImpresionesController>(ImpresionesController);
  });

  afterEach(() => jest.clearAllMocks());

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('crearImpresion', () => {
    const dto = {
      colorOpcion1: 'Rojo',
      colorOpcion2: 'Azul',
      colorOpcion3: 'Verde',
      comentario: 'Test comentario',
    };

    const reqMock = {
      usuario: { id: 'uuid-estudiante', correo: 'juan@utalca.cl', rol: 'ESTUDIANTE' },
    } as RequestConUsuario;

    const filesMock = {
      modelo3d: [{ filename: '123-modelo.obj' }] as Express.Multer.File[],
      modeloStl: [{ filename: '123-modelo.stl' }] as Express.Multer.File[],
    };

    it('debe crear una impresion exitosamente', async () => {
      const impresionMock = {
        idImpresion: 'uuid-imp-123',
        colorOpcion1: dto.colorOpcion1,
        colorOpcion2: dto.colorOpcion2,
        colorOpcion3: dto.colorOpcion3,
        comentario: dto.comentario,
        urlModelo3d: filesMock.modelo3d[0].filename,
        urlModeloStl: filesMock.modeloStl[0].filename,
        refEstudiante: reqMock.usuario.id,
        estado: EstadoImpresion.PENDIENTE,
        creadoEn: new Date(),
        solicitanteNombre: null,
        solicitanteApellido: null,
        solicitanteCorreo: null,
        solicitanteRut: null,
        refAyudante: null,
        tipoUsuario: null,
        tipoSolicitud: null,
        nombreCurso: null,
        refCurso: null,
        comentarioTecnico: null,
        observacionAyudante: null,
        motivoRechazo: null,
        tiempoEstimadoImpresion: null,
        inicioImpresion: null,
      };
      mockImpresionesService.crearImpresion.mockResolvedValue(impresionMock);

      const resultado = await controller.crearImpresion(dto, filesMock, reqMock);

      expect(resultado).toEqual(impresionMock);
      expect(mockImpresionesService.crearImpresion).toHaveBeenCalledWith(
        dto,
        reqMock.usuario.id,
        filesMock.modelo3d[0].filename,
        filesMock.modeloStl[0].filename,
      );
    });

    it('Lanzar BadRequestException si faltan archivos', async () => {
      const filesVacios = {
        modelo3d: undefined,
        modeloStl: undefined,
      };

      await expect(controller.crearImpresion(dto, filesVacios, reqMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
