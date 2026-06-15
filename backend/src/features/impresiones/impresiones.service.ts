import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Impresion, EstadoImpresion } from '@prisma/client';
import { CrearImpresionDto } from './impresiones.dto';

@Injectable()
export class ImpresionesService {
  constructor(private prisma: PrismaService) {}

  // Crea una nueva impresion con los datos
  async crearImpresion(
    dto: CrearImpresionDto,
    refEstudiante: string,
    urlModelo3d: string,
    urlModeloStl: string,
  ): Promise<Impresion> {
    return await this.prisma.impresion.create({
      // Crea una nueva impresion en la base de datos
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
  async cambiarEstado(idImpresion: string, estado: EstadoImpresion): Promise<Impresion> {
    return await this.prisma.impresion.update({
      where: {
        idImpresion: idImpresion,
      },
      data: {
        estado: estado,
      },
    });
  }
}
