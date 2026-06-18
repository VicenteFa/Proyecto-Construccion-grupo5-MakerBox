import { Test, TestingModule } from '@nestjs/testing';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { RequestConUsuario } from '../auth/auth.guard';
import { TipoRol, Curso } from '@prisma/client';

describe('CursosController', () => {
  let controller: CursosController;
  let service: CursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosController],
      providers: [
        {
          provide: CursosService,
          useValue: {
            crearCurso: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CursosController>(CursosController);
    service = module.get<CursosService>(CursosService);
  });

  it('debe llamar al servicio para crear un curso', async () => {
    const mockDto = { nombre: 'Software', refSemestre: 'uuid-semestre' };
    const idProfesor = 'uuid-profesor-123';

    // Simulamos la request modificada por el Guard
    const mockRequest = {
      user: { id: idProfesor, correo: 'test@test.com', rol: TipoRol.PROFESOR },
    } as RequestConUsuario;

    const mockRespuesta = {
      idCurso: 'uuid-curso',
      ...mockDto,
      refProfesor: idProfesor,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      borradoEn: null,
    } as unknown as Curso;

    const crearCursoSpy = jest.spyOn(service, 'crearCurso').mockResolvedValue(mockRespuesta);

    const resultado = await controller.crearCurso(mockDto, mockRequest);

    expect(resultado).toEqual(mockRespuesta);
    expect(crearCursoSpy).toHaveBeenCalledWith(idProfesor, mockDto);
  });
});
