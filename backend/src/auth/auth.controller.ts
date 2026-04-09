import { Controller, Get } from '@nestjs/common';

@Controller('Login')
export class AuthController {

  @Get()
  login(): string {
    return '<h1> Este es el Login </h1>';
  }
}