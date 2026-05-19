import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Module({
  controllers: [],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
