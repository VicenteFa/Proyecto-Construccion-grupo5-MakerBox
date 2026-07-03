import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CrearCursoDto } from './cursos.dto';

import { TipoRol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Readable } from 'stream';
import csv from 'csv-parser';

interface DatosEstudiante {
  rut: string;
  correo: string;
  nombre: string;
  apellido: string;
}

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async crearCurso(idProfesor: string, dto: CrearCursoDto) {
    const nuevoCurso = await this.prisma.curso.create({
      data: {
        nombre: dto.nombre,
        refSemestre: dto.refSemestre,
        refProfesor: idProfesor, // Este ID viene blindado desde el token JWT
      },
    });

    return nuevoCurso;
  }

  async obtenerCursosProfesor(idProfesor: string) {
    return this.prisma.curso.findMany({
      where: { refProfesor: idProfesor },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async cargarEstudiantesCsv(idCurso: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se detectó ningún archivo CSV');
    }

    const estudiantesProcesados: DatosEstudiante[] = [];
    const saltos = 10;
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row: Record<string, string>) => {
          const keys = Object.keys(row);

          console.log('Row recibida:', row);

          const rutKey = keys.find((k) => k.includes('Nombre de us'));
          const correoKey = keys.find((k) => k.includes('Dirección de'));
          const nombreKey = keys.find((k) => k.includes('Nombre') && !k.includes('us'));
          const apellidoKey = keys.find((k) => k.includes('Apellido'));

          if (rutKey && correoKey) {
            estudiantesProcesados.push({
              rut: String(row[rutKey]).trim(),
              correo: String(row[correoKey]).trim(),
              nombre: nombreKey ? String(row[nombreKey]).trim() : 'Estudiante',
              apellido: apellidoKey ? String(row[apellidoKey]).trim() : '',
            });
          }
        })
        .on('end', () => {
          console.log('Total procesados:', estudiantesProcesados.length);

          const procesarEnBaseDeDatos = async () => {
            let inscritos = 0;

            for (const est of estudiantesProcesados) {
              let usuario = await this.prisma.usuario.findFirst({
                where: { correo: est.correo },
              });

              if (!usuario) {
                const passHasheada = await bcrypt.hash(est.rut, saltos);
                usuario = await this.prisma.usuario.create({
                  data: {
                    rut: est.rut,
                    nombre: est.nombre,
                    apellido: est.apellido,
                    correo: est.correo,
                    passUsuario: passHasheada,
                    usuarioRol: TipoRol.ESTUDIANTE,
                  },
                });
              }

              await this.prisma.curso.update({
                where: { idCurso },
                data: {
                  estudiantes: {
                    connect: { idUsuario: usuario.idUsuario },
                  },
                },
              });

              inscritos++;
            }

            resolve({ mensaje: `Éxito. Se inscribieron ${inscritos} estudiantes en el curso.` });
          };
          procesarEnBaseDeDatos().catch((error: unknown) => {
            console.error('Error en DB:', error);
            reject(error instanceof Error ? error : new Error(String(error)));
          });
        })
        .on('error', (error: Error) => {
          console.error('Error CSV:', error);
          reject(new BadRequestException('Error al leer el archivo CSV: ' + error.message));
        });
    });
  }

  async eliminarCurso(idCurso: string) {
    // Nota: Si tienes cascada configurada en la BD se borrará todo automáticamente.
    // Si no, Prisma arrojará un error si el curso tiene estudiantes inscritos o ayudantías.
    return this.prisma.curso.delete({
      where: { idCurso },
    });
  }
}
