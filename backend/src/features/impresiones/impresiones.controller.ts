import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Patch,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImpresionesService } from './impresiones.service';
import { CrearImpresionDto } from './impresiones.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import type { RequestConUsuario } from '../../shared/guards/auth.guard';
import { EstadoImpresion } from '@prisma/client';

@Controller('impresiones')
export class ImpresionesController {
  constructor(private readonly impresionesService: ImpresionesService) {}

  // 1. Obtenemos todas las impresiones
  @Get()
  async obtenerTodasLasImpresiones(): Promise<any> {
    return this.impresionesService.obtenerTodas();
  }

  // 2. ACTUALIZAMOS UNA IMPRESIÓN (Separado y limpio)
  @Patch(':id')
  async actualizarImpresion(
    @Param('id') id: string,
    @Body() datos: { estado: EstadoImpresion; observacionAyudante: string },
  ) {
    return this.impresionesService.cambiarEstado(id, datos.estado);
  }

  // 3. CREAMOS UNA IMPRESIÓN (El @Post y los Interceptors van juntos pegados a la función)
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'modelo3d', maxCount: 1 },
        { name: 'modeloStl', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            const nombreUnico = `${Date.now()}-${file.originalname}`;
            cb(null, nombreUnico);
          },
        }),
        fileFilter: (_req, file, cb) => {
          const extensionesPermitidas = ['.stl', '.obj', '.f3d', '.step', '.ipt'];
          const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
          if (extensionesPermitidas.includes(ext)) {
            cb(null, true);
          } else {
            cb(new Error(`Extensión no permitida: ${ext}`), false);
          }
        },
        limits: { fileSize: 50 * 1024 * 1024 },
      },
    ),
  )
  async crearImpresion(
    @Body() dto: CrearImpresionDto,
    @UploadedFiles()
    files: {
      modelo3d?: Express.Multer.File[];
      modeloStl?: Express.Multer.File[];
    },
    @Request() req: RequestConUsuario,
  ) {
    if (!files.modelo3d?.[0] || !files.modeloStl?.[0]) {
      throw new BadRequestException('Se requieren ambos archivos: modelo3d y modeloStl');
    }

    const urlModelo3d = files.modelo3d[0].filename;
    const urlModeloStl = files.modeloStl[0].filename;
    const refEstudiante = req.usuario.id;

    return this.impresionesService.crearImpresion(dto, refEstudiante, urlModelo3d, urlModeloStl);
  }
}
