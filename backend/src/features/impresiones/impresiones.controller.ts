import { Controller } from '@nestjs/common';
import { ImpresionesService } from './impresiones.service';

@Controller('impresiones')
export class ImpresionesController {
  constructor(private readonly impresionesService: ImpresionesService) {}
}
