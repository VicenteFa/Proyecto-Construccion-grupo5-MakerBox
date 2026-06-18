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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImpresionesService } from './impresiones.service';
import { CrearImpresionDto } from './impresiones.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import type { RequestConUsuario } from '../../shared/guards/auth.guard';

@Controller('impresiones')
export class ImpresionesController {
  constructor(private readonly impresionesService: ImpresionesService) {}

  //Obtenemos todas las impresiones con el @Get
  @Get()
  async obtenerTodasLasImpresiones(): Promise<any> {
    return this.impresionesService.obtenerTodas();
  }
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
          destination: './uploads', // Se Creara una carpeta "uploads" en la raiz del proyecto para almacenar los archivos subidos
          filename: (_req, file, cb) => {
            // se agrega la fecha al inicio para que no se sobreescriban archivos con el mismo nombre
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
        limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB por archivo
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
