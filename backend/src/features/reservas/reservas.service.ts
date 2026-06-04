import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class ReservasService {
  constructor(private prisma: PrismaService) {}

  async obtenerReservasPorRut(rut: string) {
    return await this.prisma.reserva.findMany({
      where: {
        solicitanteRut: rut,
      },
    });
  }
}
