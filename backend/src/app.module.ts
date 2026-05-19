import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

//import { PrismaModule } from './shared/prisma/prisma.module';

import { AuthModule } from './features/auth/auth.module';
import { UsuariosModule } from './features/usuarios/usuarios.module';
import { ImpresionesModule } from './features/impresiones/impresiones.module';
import { ReservasModule } from './features/reservas/reservas.module';
import { InventarioModule } from './features/inventario/inventario.module';
import { CursosModule } from './features/cursos/cursos.module';
import { AyudantiasModule } from './features/ayudantias/ayudantias.module';
import { NotificacionesModule } from './features/notificaciones/notificaciones.module';

const API_PREFIX = 'api';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: [`/${API_PREFIX}/{*path}`],
    }),

    // PrismaModule,

    AuthModule,
    UsuariosModule,
    ImpresionesModule,
    ReservasModule,
    InventarioModule,
    CursosModule,
    AyudantiasModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
