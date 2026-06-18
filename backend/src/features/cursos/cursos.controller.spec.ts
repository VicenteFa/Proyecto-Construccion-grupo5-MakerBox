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
            cargarEstudiantesCsv: jest.fn(),
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

  it('debe llamar al servicio para cargar estudiantes desde un CSV', async () => {
    const idCurso = 'uuid-curso-123';

    const mockFile = {
      fieldname: 'file',
      originalname: 'estudiantes.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from('Nombre,Apellido\nTest,Prueba'),
      size: 100,
    } as Express.Multer.File;

    const mockRespuesta = { mensaje: 'Exito. Se inscribieron 1 estudiantes en el curso.' };

    const cargarSpy = jest.spyOn(service, 'cargarEstudiantesCsv').mockResolvedValue(mockRespuesta);

    const resultado = await controller.cargarEstudiantes(idCurso, mockFile);

    expect(resultado).toEqual(mockRespuesta);
    expect(cargarSpy).toHaveBeenCalledWith(idCurso, mockFile);
  });
});
