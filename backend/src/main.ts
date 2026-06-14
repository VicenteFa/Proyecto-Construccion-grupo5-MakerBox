import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const API_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // lanza error si vienen campos extra
      transform: true, // transforma body al tipo del DTO
    }),
  );

  app.enableCors({
    origin: /^http:\/\/localhost:\d+$/,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => console.error(err));
