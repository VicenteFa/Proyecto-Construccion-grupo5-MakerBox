import { Test, TestingModule } from '@nestjs/testing';
import { CursosService } from './cursos.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Curso } from '@prisma/client';

describe('CursosService', () => {
  let service: CursosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        {
          provide: PrismaService,
          useValue: {
            curso: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe crear un curso y vincularlo al profesor', async () => {
    const idProfesor = 'uuid-profesor-123';
    const mockDto = { nombre: 'Software', refSemestre: 'uuid-semestre' };

    const mockRespuesta = {
      idCurso: 'uuid-curso',
      ...mockDto,
      refProfesor: idProfesor,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      borradoEn: null,
    } as unknown as Curso;

    const createSpy = jest.spyOn(prisma.curso, 'create').mockResolvedValue(mockRespuesta);

    const resultado = await service.crearCurso(idProfesor, mockDto);

    expect(resultado).toEqual(mockRespuesta);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        nombre: mockDto.nombre,
        refSemestre: mockDto.refSemestre,
        refProfesor: idProfesor,
      },
    });
  });
});
