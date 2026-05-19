import { Controller } from '@nestjs/common';
import { AyudantiasService } from './ayudantias.service';

@Controller('ayudantias')
export class AyudantiasController {
  constructor(private readonly ayudantiasService: AyudantiasService) {}
}
