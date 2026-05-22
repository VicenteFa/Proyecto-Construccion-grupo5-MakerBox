import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    this.logger.log('PrismaClient inicializado');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('La DB fue conectada con exito');
    } catch (error) {
      this.logger.error('Conexion a la DB fallo', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
