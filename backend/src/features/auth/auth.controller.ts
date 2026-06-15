import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TipoRol } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegistroDto, LoginDto } from './auth.dto';
import { Roles } from './roles.decorator';
import { AuthRolesGuard } from './auth.guard';

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

  @Post('registrar/profesor')
  registrarProfesor(@Body() dto: RegistroDto) {
    return this.authService.registrarProfesor(dto);
  }

  @UseGuards(AuthRolesGuard)
  @Roles(TipoRol.PROFESOR)
  @Get('prueba-profesor')
  rutaProtegida() {
    return { mensaje: '¡Éxito! El token es válido y tienes rol de PROFESOR.' };
  }
}
