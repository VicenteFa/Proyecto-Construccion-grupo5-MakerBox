import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() datosRegistro: RegistroDto) {
    return this.authService.registrarEstudiante(datosRegistro);
  }

  @Post('login')
  async login(@Body() datosLogin: LoginDto) {
    return this.authService.login(datosLogin);
  }
}
