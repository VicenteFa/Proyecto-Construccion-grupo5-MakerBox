import { Module } from '@nestjs/common';
import { AyudantiasController } from './ayudantias.controller';
import { AyudantiasService } from './ayudantias.service';

@Module({
  controllers: [AyudantiasController],
  providers: [AyudantiasService],
})
export class AyudantiasModule {}
