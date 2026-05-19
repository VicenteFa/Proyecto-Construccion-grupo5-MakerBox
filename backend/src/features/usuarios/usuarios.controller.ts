import { Controller } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios') //
export class UsuariosController {
  // Aquí inyectamos el servicio (nuestro "chef")
  constructor(private readonly usuariosService: UsuariosService) {}
}
