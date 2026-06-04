import * as dotenv from 'dotenv';
dotenv.config({ override: true });
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TipoRol, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

describe('UsuariosService (Pruebas de integracion)', () => {
  let service: UsuariosService;
  let prisma: PrismaClient;
  let module: TestingModule;

  // Sufijo aleatorio para no chocar con datos reales de la BD
  const sufijoUnico = Math.floor(Math.random() * 10000).toString();
  const rutPrueba = `11111111-${sufijoUnico.slice(0, 1)}`;
  const correoPrueba = `test_${sufijoUnico}@makerbox.cl`;

  beforeAll(async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    module = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    await module.init();
    service = module.get<UsuariosService>(UsuariosService);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: { correo: { contains: 'makerbox.cl' } },
    });

    await prisma.$disconnect();
    await module.close();
  });

  describe('agregarUsuario', () => {
    it('crear un usuario, guardar en BD y retornar sin la contraseña', async () => {
      const datosPrueba = {
        rut: rutPrueba,
        nombre: 'Prueba',
        apellido: 'Nube',
        correo: correoPrueba,
        passUsuario: 'hash123',
        usuarioRol: TipoRol.ESTUDIANTE,
      };

      const resultado = await service.agregarUsuario(datosPrueba);

      expect(resultado).toBeDefined();
      expect(resultado).not.toHaveProperty('passUsuario');
      expect(resultado.correo).toBe(datosPrueba.correo);

      const usuarioEnBd = await prisma.usuario.findUnique({
        where: { idUsuario: resultado.idUsuario },
      });
      expect(usuarioEnBd).not.toBeNull();
    });

    it('ConflictException si el RUT o el correo ya estan registrados', async () => {
      const datosDuplicados = {
        rut: rutPrueba,
        nombre: 'Clon',
        apellido: 'Rut',
        correo: correoPrueba,
        passUsuario: '123',
        usuarioRol: TipoRol.ESTUDIANTE,
      };

      await expect(service.agregarUsuario(datosDuplicados)).rejects.toThrow(ConflictException);
    });
  });

  describe('obtenerUsuario', () => {
    it('Retornar usuario existente por su ID sin la contrasena', async () => {
      const usuarioInsertado = await prisma.usuario.findFirst({
        where: { correo: correoPrueba },
      });

      if (usuarioInsertado) {
        const resultado = await service.obtenerUsuario(usuarioInsertado.idUsuario);
        expect(resultado).toBeDefined();
        expect(resultado.idUsuario).toBe(usuarioInsertado.idUsuario);
        expect(resultado).not.toHaveProperty('passUsuario');
      }
    });

    it('NotFoundException, el usuario no existe', async () => {
      const idInexistente = '00000000-0000-0000-0000-000000000000';
      await expect(service.obtenerUsuario(idInexistente)).rejects.toThrow(NotFoundException);
    });
  });
});
