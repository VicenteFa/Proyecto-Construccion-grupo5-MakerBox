import { Test, TestingModule } from '@nestjs/testing';
import { ImpresionesService } from './impresiones.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EstadoImpresion, Impresion } from '@prisma/client';

const mockPrismaService = {
  impresion: {
    update: jest.fn(),
  },
};
describe('ImpresionesService', () => {
  let service: ImpresionesService;

  const mockPrismaService = {
    impresion: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImpresionesService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<ImpresionesService>(ImpresionesService);
  });

  it('debería actualizar el estado de una impresión exitosamente', async () => {
    const idPrueba = 'a814a77a-b70c-461d-8f43-912b54e8384b';
    const nuevoEstado = EstadoImpresion.IMPRIMIENDO;
    const nuevaObservacion = 'El modelo pasó la revisión de malla';

    mockPrismaService.impresion.update.mockResolvedValue({
      idImpresion: idPrueba,
      estado: nuevoEstado,
      observacionAyudante: nuevaObservacion,
    });

    const resultado = await service.cambiarEstado(idPrueba, nuevoEstado, nuevaObservacion);

    expect(mockPrismaService.impresion.update).toHaveBeenCalledWith({
      where: { idImpresion: idPrueba },
      data: {
        estado: nuevoEstado,
        observacionAyudante: nuevaObservacion,
      },
    });

    expect(resultado.estado).toEqual(nuevoEstado);
    expect(resultado.observacionAyudante).toEqual(nuevaObservacion);
  });
});

describe('ImpresionesService', () => {
  let service: ImpresionesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImpresionesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ImpresionesService>(ImpresionesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('cambiarEstado', () => {
    it('cambiar el estado de una impresion exitosamente', async () => {
      const idImpresionTest = 'uuid-1234-5678';
      const nuevoEstado = EstadoImpresion.IMPRIMIENDO;

      //creacion a mano de una impresion para que el linter no se queje de que no se esta usando el tipo Impresion en el test
      const impresionActualizadaMock: Impresion = {
        idImpresion: idImpresionTest,
        solicitanteNombre: 'Mock Nombre',
        solicitanteApellido: 'Mock Apellido',
        solicitanteCorreo: 'mock@correo.com',
        solicitanteRut: '12345678-9',
        refEstudiante: 'uuid-estudiante',
        refAyudante: 'uuid-ayudante',
        tipoUsuario: 'ESTUDIANTE',
        tipoSolicitud: 'TEST',
        nombreCurso: 'Curso Test',
        refCurso: 'uuid-curso',
        colorOpcion1: 'Rojo',
        colorOpcion2: 'Azul',
        colorOpcion3: 'Verde',
        comentarioTecnico: 'Ninguno',
        urlModelo3d: 'http://test.com/3d',
        urlModeloStl: 'http://test.com/stl',
        comentario: 'Test comentario',
        estado: nuevoEstado,
        observacionAyudante: null,
        motivoRechazo: null,
        tiempoEstimadoImpresion: '2h',
        inicioImpresion: new Date(),
        creadoEn: new Date(),
      };

      const updateSpy = jest
        .spyOn(prisma.impresion, 'update')
        .mockResolvedValue(impresionActualizadaMock);

      const resultado = await service.cambiarEstado(idImpresionTest, nuevoEstado);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { idImpresion: idImpresionTest },
        data: { estado: nuevoEstado },
      });
      expect(resultado).toEqual(impresionActualizadaMock);
    });

    it('error si Prisma falla)', async () => {
      const idImpresionTest = 'uuid-invalido';
      const nuevoEstado = EstadoImpresion.FINALIZADA;
      const errorPrisma = new Error('Registro no encontrado');

      jest.spyOn(prisma.impresion, 'update').mockRejectedValue(errorPrisma);

      await expect(service.cambiarEstado(idImpresionTest, nuevoEstado)).rejects.toThrow(
        errorPrisma,
      );
    });
  });
});
