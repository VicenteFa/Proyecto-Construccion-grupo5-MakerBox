import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Impresion, EstadoImpresion } from '@prisma/client';
import { CrearImpresionDto } from './impresiones.dto';

@Injectable()
export class ImpresionesService {
  constructor(private prisma: PrismaService) {}

  async crearImpresion(
    dto: CrearImpresionDto,
    refEstudiante: string,
    urlModelo3d: string,
    urlModeloStl: string,
  ): Promise<Impresion> {
    return await this.prisma.impresion.create({
      data: {
        colorOpcion1: dto.colorOpcion1,
        colorOpcion2: dto.colorOpcion2,
        colorOpcion3: dto.colorOpcion3,
        comentario: dto.comentario,
        urlModelo3d,
        urlModeloStl,
        refEstudiante,
        estado: EstadoImpresion.PENDIENTE,
      },
    });
  }

  /**
   * Cambia el estado de una impresion especifica
   * @param idImpresion ID (UUID) de la impresion
   * @param estado Nuevo estado a asignar
   * @returns La impresion actualizada
   */
  async cambiarEstado(
    idImpresion: string,
    estado: EstadoImpresion,
    observacionAyudante?: string,
  ): Promise<Impresion> {
    return await this.prisma.impresion.update({
      where: {
        idImpresion: idImpresion,
      },
      data: {
        estado: estado,
        observacionAyudante: observacionAyudante,
      },
    });
  }

  async obtenerTodas(): Promise<Impresion[]> {
    const impresiones = await this.prisma.impresion.findMany({
      orderBy: {
        creadoEn: 'desc',
      },
      include: {
        estudiante: true, // Incluye la relación con el modelo Usuario
      },
    });

    return impresiones.map((Impresion) => ({
      ...Impresion,
      solicitanteNombre: Impresion.estudiante?.nombre || '',
      solicitanteApellido: Impresion.estudiante?.apellido || '',
      solicitanteCorreo: Impresion.estudiante?.correo || '',
      solicitanteRut: Impresion.estudiante?.rut || '',
    }));
  }
  async actualizarEstado(id: string, nuevoEstado: EstadoImpresion, nuevaObservacion: string) {
    return this.prisma.impresion.update({
      where: {
        idImpresion: id, // Busca el registro por su llave primaria real
      },
      data: {
        estado: nuevoEstado,
        observacionAyudante: nuevaObservacion,
      },
    });
  }
}
