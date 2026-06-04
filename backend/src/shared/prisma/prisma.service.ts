import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    const pool = new Pool({
      connectionString,
      ...(isProduction && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.logger.log('PrismaClient inicializado con driver adapter y SSL');
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
