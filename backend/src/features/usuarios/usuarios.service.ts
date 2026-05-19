import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable() // <- Esto le dice a NestJS que esta clase es un servicio que puede ser inyectado en otros lugares
export class UsuariosService {
  //constructor(private prisma: PrismaService) {}
}
