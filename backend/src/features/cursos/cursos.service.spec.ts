import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Curso, TipoRol, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = jest.mocked(bcrypt);

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
              findMany: jest.fn(),
              update: jest.fn(),
            },
            usuario: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const buildCsvFile = (contenido: string): Express.Multer.File =>
    ({
      buffer: Buffer.from(contenido, 'utf-8'),
      fieldname: 'file',
      originalname: 'estudiantes.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      size: Buffer.byteLength(contenido, 'utf-8'),
    }) as Express.Multer.File;

  describe('crearCurso', () => {
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

  describe('obtenerCursosProfesor', () => {
    it('debe retornar los cursos de un profesor ordenados por fecha de creación descendente', async () => {
      const idProfesor = 'uuid-profesor-123';
      const mockCursos = [
        { idCurso: 'curso-1', nombre: 'Curso 1' },
        { idCurso: 'curso-2', nombre: 'Curso 2' },
      ] as unknown as Curso[];

      const findManySpy = jest.spyOn(prisma.curso, 'findMany').mockResolvedValue(mockCursos);

      const resultado = await service.obtenerCursosProfesor(idProfesor);

      expect(resultado).toEqual(mockCursos);
      expect(findManySpy).toHaveBeenCalledWith({
        where: { refProfesor: idProfesor },
        orderBy: { creadoEn: 'desc' },
      });
    });

    it('debe retornar un array vacio si el profesor no tiene cursos', async () => {
      jest.spyOn(prisma.curso, 'findMany').mockResolvedValue([]);

      const resultado = await service.obtenerCursosProfesor('uuid-sin-cursos');

      expect(resultado).toEqual([]);
    });
  });

  describe('cargarEstudiantesCsv', () => {
    const idCurso = 'uuid-curso-123';

    it('debe lanzar BadRequestException si no se proporciona archivo', async () => {
      await expect(
        service.cargarEstudiantesCsv(idCurso, undefined as unknown as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe crear un nuevo usuario estudiante si no existe y vincularlo al curso', async () => {
      const csv = [
        'Nombre de usuario,Dirección de correo electrónico,Nombre,Apellido',
        '12345678-9,juan.perez@test.com,Juan,Perez',
      ].join('\n');

      jest.spyOn(prisma.usuario, 'findFirst').mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hash-falso' as never);

      const usuarioCreado = {
        idUsuario: 'uuid-usuario-nuevo',
        rut: '12345678-9',
        nombre: 'Juan',
        apellido: 'Perez',
        correo: 'juan.perez@test.com',
        passUsuario: 'hash-falso',
        usuarioRol: TipoRol.ESTUDIANTE,
      } as unknown as Usuario;

      const createUsuarioSpy = jest
        .spyOn(prisma.usuario, 'create')
        .mockResolvedValue(usuarioCreado);
      const updateCursoSpy = jest.spyOn(prisma.curso, 'update').mockResolvedValue({} as Curso);

      const resultado = await service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv));

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('12345678-9', 10);
      expect(createUsuarioSpy).toHaveBeenCalledWith({
        data: {
          rut: '12345678-9',
          nombre: 'Juan',
          apellido: 'Perez',
          correo: 'juan.perez@test.com',
          passUsuario: 'hash-falso',
          usuarioRol: TipoRol.ESTUDIANTE,
        },
      });
      expect(updateCursoSpy).toHaveBeenCalledWith({
        where: { idCurso },
        data: {
          estudiantes: {
            connect: { idUsuario: usuarioCreado.idUsuario },
          },
        },
      });
      expect(resultado).toEqual({
        mensaje: 'Éxito. Se inscribieron 1 estudiantes en el curso.',
      });
    });

    it('debe usar un usuario existente sin crearlo de nuevo si ya existe por correo', async () => {
      const csv = [
        'Nombre de usuario,Dirección de correo electrónico,Nombre,Apellido',
        '98765432-1,maria.lopez@test.com,Maria,Lopez',
      ].join('\n');

      const usuarioExistente = {
        idUsuario: 'uuid-usuario-existente',
        correo: 'maria.lopez@test.com',
      } as unknown as Usuario;

      jest.spyOn(prisma.usuario, 'findFirst').mockResolvedValue(usuarioExistente);
      const createUsuarioSpy = jest.spyOn(prisma.usuario, 'create');
      const updateCursoSpy = jest.spyOn(prisma.curso, 'update').mockResolvedValue({} as Curso);

      const resultado = await service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv));

      expect(createUsuarioSpy).not.toHaveBeenCalled();
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(updateCursoSpy).toHaveBeenCalledWith({
        where: { idCurso },
        data: {
          estudiantes: {
            connect: { idUsuario: usuarioExistente.idUsuario },
          },
        },
      });
      expect(resultado).toEqual({
        mensaje: 'Éxito. Se inscribieron 1 estudiantes en el curso.',
      });
    });

    it('debe usar valores por defecto para nombre y apellido cuando no vienen en el CSV', async () => {
      const csv = [
        'Nombre de usuario,Dirección de correo electrónico',
        '11111111-1,sin.nombre@test.com',
      ].join('\n');

      jest.spyOn(prisma.usuario, 'findFirst').mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hash-falso' as never);
      const createUsuarioSpy = jest.spyOn(prisma.usuario, 'create').mockResolvedValue({
        idUsuario: 'uuid-usuario-x',
      } as unknown as Usuario);
      jest.spyOn(prisma.curso, 'update').mockResolvedValue({} as Curso);

      await service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv));

      expect(createUsuarioSpy).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nombre: 'Estudiante',
          apellido: '',
        }) as unknown,
      });
    });

    it('debe omitir filas que no tengan columnas de rut o correo identificables', async () => {
      const csv = ['Nombre,Apellido', 'Juan,Perez'].join('\n');

      const findFirstSpy = jest.spyOn(prisma.usuario, 'findFirst');
      const updateCursoSpy = jest.spyOn(prisma.curso, 'update');

      const resultado = await service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv));

      expect(findFirstSpy).not.toHaveBeenCalled();
      expect(updateCursoSpy).not.toHaveBeenCalled();
      expect(resultado).toEqual({
        mensaje: 'Éxito. Se inscribieron 0 estudiantes en el curso.',
      });
    });

    it('debe procesar múltiples estudiantes y contar correctamente los inscritos', async () => {
      const csv = [
        'Nombre de usuario,Dirección de correo electrónico,Nombre,Apellido',
        '11111111-1,uno@test.com,Uno,Apellido1',
        '22222222-2,dos@test.com,Dos,Apellido2',
      ].join('\n');

      jest.spyOn(prisma.usuario, 'findFirst').mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hash-falso' as never);
      jest
        .spyOn(prisma.usuario, 'create')
        .mockResolvedValueOnce({ idUsuario: 'usuario-1' } as unknown as Usuario)
        .mockResolvedValueOnce({ idUsuario: 'usuario-2' } as unknown as Usuario);
      const updateCursoSpy = jest.spyOn(prisma.curso, 'update').mockResolvedValue({} as Curso);

      const resultado = await service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv));

      expect(updateCursoSpy).toHaveBeenCalledTimes(2);
      expect(resultado).toEqual({
        mensaje: 'Éxito. Se inscribieron 2 estudiantes en el curso.',
      });
    });

    it('debe rechazar la promesa si ocurre un error al consultar/actualizar la base de datos', async () => {
      const csv = [
        'Nombre de usuario,Dirección de correo electrónico,Nombre,Apellido',
        '33333333-3,error@test.com,Error,Test',
      ].join('\n');

      const errorDb = new Error('Fallo de conexion a la base de datos');
      jest.spyOn(prisma.usuario, 'findFirst').mockRejectedValue(errorDb);

      await expect(service.cargarEstudiantesCsv(idCurso, buildCsvFile(csv))).rejects.toThrow(
        errorDb,
      );
    });

    it('debe rechazar con BadRequestException si el stream del CSV emite un error de lectura', async () => {
      const fileCorrupto = {
        buffer: null,
      } as unknown as Express.Multer.File;

      await expect(service.cargarEstudiantesCsv(idCurso, fileCorrupto)).rejects.toBeDefined();
    });
  });
});
