import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './shared/prisma/prisma.service';

//este seed es para crear un semestre.
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('Iniciando carga de datos base...');

  try {
    const nuevoSemestre = await prisma.semestre.create({
      data: {},
    });

    console.log(nuevoSemestre.idSemestre);
  } catch (error) {
    console.error('Error al crear el semestre:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
