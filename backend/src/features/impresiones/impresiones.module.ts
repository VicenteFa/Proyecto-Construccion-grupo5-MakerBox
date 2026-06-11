import { Module } from '@nestjs/common';
import { ImpresionesController } from './impresiones.controller';
import { ImpresionesService } from './impresiones.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImpresionesController],
  providers: [ImpresionesService],
})
export class ImpresionesModule {}
