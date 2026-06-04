import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Impresion, EstadoImpresion } from '@prisma/client';

@Injectable()
export class ImpresionesService {
  constructor(private prisma: PrismaService) {}

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
