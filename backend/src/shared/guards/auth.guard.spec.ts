import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import * as jwt from 'jsonwebtoken';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  const crearContexto = (authHeader?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: authHeader },
          usuario: undefined,
        }),
      }),
    }) as unknown as ExecutionContext;

  it('debe estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('debe permitir el acceso con un token valido', () => {
    const token = jwt.sign(
      { id: 'uuid-123', correo: 'juan@utalca.cl', rol: 'ESTUDIANTE' },
      process.env.JWT_SECRET ?? 'secret',
    );
    const ctx = crearContexto(`Bearer ${token}`);

    const resultado = guard.canActivate(ctx);

    expect(resultado).toBe(true);
  });

  it('debe lanzar UnauthorizedException si no hay token', () => {
    const ctx = crearContexto(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('debe lanzar UnauthorizedException si el header no tiene formato Bearer', () => {
    const ctx = crearContexto('Token invalido');

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('debe lanzar UnauthorizedException si el token es invalido', () => {
    const ctx = crearContexto('Bearer token-invalido');

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });
});
