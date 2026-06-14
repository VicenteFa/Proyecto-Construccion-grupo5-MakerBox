// features/auth/auth.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString()
  rut!: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsEmail() // El correo debe ser un correo valido
  correo!: string;

  @IsString()
  @MinLength(6) // La contraseña debe tener al menos 6 caracteres
  passUsuario!: string;
}

export class LoginDto {
  @IsEmail() // El correo debe ser un correo valido
  correo!: string;

  @IsString()
  @MinLength(6) // La contraseña debe tener al menos 6 caracteres
  passUsuario!: string;
}
