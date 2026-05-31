import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TipoRol } from '../../generated/client';

describe('UsuariosService (Pruebas de Integración)', () => {
  let service: UsuariosService;
  let prisma: PrismaService;
  let module: TestingModule; //

  beforeAll(async () => {
    // Guarda modulo en la variable
    module = await Test.createTestingModule({
      providers: [UsuariosService, PrismaService],
    }).compile();

    await module.init();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // limpiar la base de datos antes de cada prueba
  beforeEach(async () => {
    await prisma.usuario.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  describe('agregarUsuario', () => {
    it('crear un usuario y guardarlo en la base de datos', async () => {
      const datosPrueba = {
        rut: '12345678-9',
        nombre: 'Prueba',
        apellido: 'Integracion',
        correo: 'prueba@ejemplo.com',
        passUsuario: 'hash123',
        usuarioRol: TipoRol.ESTUDIANTE,
      };

      const resultado = await service.agregarUsuario(datosPrueba);

      expect(resultado).toBeDefined();
      expect(resultado.idUsuario).toBeDefined();
      expect(resultado.correo).toBe(datosPrueba.correo);

      const usuarioEnBd = await prisma.usuario.findUnique({
        where: { idUsuario: resultado.idUsuario },
      });
      expect(usuarioEnBd).not.toBeNull();
      expect(usuarioEnBd?.nombre).toBe(datosPrueba.nombre);
    });
  });

  describe('obtenerUsuario', () => {
    it('debería retornar un usuario existente por su ID', async () => {
      // Insertar usuario primero
      const nuevoUsuario = await service.agregarUsuario({
        rut: '98765432-1',
        nombre: 'Juan',
        apellido: 'Perez',
        correo: 'juan@ejemplo.com',
        passUsuario: 'hash456',
        usuarioRol: TipoRol.PROFESOR,
      });

      // Probar metodo obtenerUsuario
      const resultado = await service.obtenerUsuario(nuevoUsuario.idUsuario);

      expect(resultado).toBeDefined();
      expect(resultado.idUsuario).toBe(nuevoUsuario.idUsuario);
      expect(resultado.nombre).toBe('Juan');
    });

    it('lanzar NotFoundException si el usuario no existe', async () => {
      const idInexistente = '00000000-0000-0000-0000-000000000000'; // UUID falso válido

      // verificar  lance  excepcion
      await expect(service.obtenerUsuario(idInexistente)).rejects.toThrow(NotFoundException);
      await expect(service.obtenerUsuario(idInexistente)).rejects.toThrow(
        `El usuario con ID ${idInexistente} no existe`,
      );
    });
  });
});
