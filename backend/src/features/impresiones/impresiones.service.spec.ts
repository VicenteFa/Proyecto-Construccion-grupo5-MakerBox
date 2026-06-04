import { Test, TestingModule } from '@nestjs/testing';
import { ImpresionesService } from './impresiones.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EstadoImpresion, Impresion } from '../../generated/client';

// Mock de PrismaService
const mockPrismaService = {
  impresion: {
    update: jest.fn(),
  },
};

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
  });

  describe('cambiarEstado', () => {
    it('debe cambiar el estado de una impresion exitosamente', async () => {
      // 1. Arrange
      const idImpresionTest = 'uuid-1234-5678';
      const nuevoEstado = EstadoImpresion.IMPRIMIENDO;

      const impresionActualizadaMock = {
        idImpresion: idImpresionTest,
        estado: nuevoEstado,
      } as Impresion;

      const updateSpy = jest
        .spyOn(prisma.impresion, 'update')
        .mockResolvedValue(impresionActualizadaMock);

      const resultado = await service.cambiarEstado(idImpresionTest, nuevoEstado);

      // 3. Assert
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { idImpresion: idImpresionTest },
        data: { estado: nuevoEstado },
      });
      expect(resultado).toEqual(impresionActualizadaMock);
    });

    it('debe lanzar un error si Prisma falla (ej. impresion no encontrada)', async () => {
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
