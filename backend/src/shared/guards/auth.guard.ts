import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express'; // Importamos la interfaz Request de Express para extenderla

export interface RequestConUsuario extends Request {
  // Extendemos la interfaz Request para incluir la propiedad "usuario"
  usuario: {
    id: string;
    correo: string;
    rol: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  // Implementamos la interfaz CanActivate para crear nuestro guard de autenticación
  canActivate(context: ExecutionContext): boolean {
    // Usamos la interfaz nueva
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Verificamos que el header de autorización exista y tenga el formato correcto
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1]; // Extraemos el token del header

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret'); // Verificamos el token usando la clave secreta
      // Guardamos el payload asegurando que cumple con la estructura esperada
      request.usuario = payload as RequestConUsuario['usuario'];
      return true;
    } catch {
      throw new UnauthorizedException('Token no es valido o esta expirado');
    }
  }
}
