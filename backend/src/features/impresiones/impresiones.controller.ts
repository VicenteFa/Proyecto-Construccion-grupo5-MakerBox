import {
  Controller,
  Post,
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
// Controlador para manejar las rutas relacionadas con las impresiones 3D
export class ImpresionesController {
  constructor(private readonly impresionesService: ImpresionesService) {}

  @Post()
  @UseInterceptors(
    // Interceptor para manejar la subida  de archivos, con configuracion para almacenar los archivos en el servidor y validar las extensiones y tamanos permitidos
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
            // Si la extension no es permitida, se rechaza el archivo y se lanza un error
            cb(new Error(`Extensión no permitida: ${ext}`), false);
          }
        },
        limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB por archivo
      },
    ),
  )
  @UseGuards(AuthGuard) // Protege la ruta para que solo usuarios autenticados puedan acceder
  async crearImpresion(
    @Body() dto: CrearImpresionDto,
    @UploadedFiles()
    files: {
      modelo3d?: Express.Multer.File[];
      modeloStl?: Express.Multer.File[];
    },
    @Request() req: RequestConUsuario,
  ) {
    console.log('FILES:', files);
    console.log('BODY:', dto);
    console.log('USUARIO:', req.usuario);

    if (!files.modelo3d?.[0] || !files.modeloStl?.[0]) {
      throw new BadRequestException('Se requieren ambos archivos: modelo3d y modeloStl');
    }

    const urlModelo3d = files.modelo3d[0].filename;
    const urlModeloStl = files.modeloStl[0].filename;
    const refEstudiante = req.usuario.id;

    return this.impresionesService.crearImpresion(dto, refEstudiante, urlModelo3d, urlModeloStl);
  }
}
