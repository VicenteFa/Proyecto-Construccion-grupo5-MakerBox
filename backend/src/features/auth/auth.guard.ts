import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { TipoRol } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';

export interface TokenPayload {
  id: string;
  correo: string;
  rol: TipoRol;
}

export interface RequestConUsuario extends Request {
  user?: TokenPayload;
}

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as TokenPayload;

      request.user = payload;

      const requiredRoles = this.reflector.getAllAndOverride<TipoRol[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) return true;

      const hasRole = requiredRoles.some((rol) => payload.rol === rol);
      if (!hasRole) throw new ForbiddenException('No tienes permisos suficientes');

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // Agregamos el tipado Request aquí también para evitar errores de implicit any
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
