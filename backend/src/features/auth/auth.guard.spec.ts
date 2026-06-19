import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { AuthRolesGuard, RequestConUsuario, TokenPayload } from './auth.guard';
import * as jwt from 'jsonwebtoken';
import { TipoRol } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

jest.mock('jsonwebtoken');
const mockedJwt = jest.mocked(jwt);

describe('AuthRolesGuard', () => {
  let guard: AuthRolesGuard;
  let reflector: Reflector;

  const mockPayload: TokenPayload = {
    id: 'user-123',
    correo: 'test@test.com',
    rol: TipoRol.PROFESOR,
  };

  const createMockContext = (
    headers: Record<string, string | undefined>,
    handler: object = {},
    classRef: object = {},
  ): ExecutionContext => {
    const request = { headers } as RequestConUsuario;
    return {
      switchToHttp: () => ({
        getRequest: (): RequestConUsuario => request,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: () => handler,
      getClass: () => classRef,
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthRolesGuard>(AuthRolesGuard);
    reflector = module.get<Reflector>(Reflector);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('debe lanzar UnauthorizedException si no hay token', () => {
      const context = createMockContext({});
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si el token no es Bearer', () => {
      const context = createMockContext({
        authorization: 'Basic token',
      });
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si el token es inválido', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const context = createMockContext({
        authorization: 'Bearer invalid-token',
      });
      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(mockedJwt.verify).toHaveBeenCalledWith(
        'invalid-token',
        process.env.JWT_SECRET ?? 'secret',
      );
    });

    it('debe asignar el payload a request.user y devolver true si no hay roles requeridos', () => {
      mockedJwt.verify.mockImplementation(() => mockPayload);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const context = createMockContext({
        authorization: 'Bearer valid-token',
      });
      const result = guard.canActivate(context);
      expect(result).toBe(true);

      const request = context.switchToHttp().getRequest<RequestConUsuario>();
      expect(request.user).toEqual(mockPayload);
    });

    it('debe permitir acceso si el usuario tiene el rol requerido', () => {
      mockedJwt.verify.mockImplementation(() => mockPayload);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride');
      getAllAndOverrideSpy.mockReturnValue([TipoRol.PROFESOR]);

      const context = createMockContext({
        authorization: 'Bearer valid-token',
      });
      const result = guard.canActivate(context);
      expect(result).toBe(true);

      const request = context.switchToHttp().getRequest<RequestConUsuario>();
      expect(request.user).toEqual(mockPayload);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('debe lanzar ForbiddenException si el usuario no tiene el rol requerido', () => {
      mockedJwt.verify.mockImplementation(() => mockPayload);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride');
      getAllAndOverrideSpy.mockReturnValue([TipoRol.ESTUDIANTE]);

      const context = createMockContext({
        authorization: 'Bearer valid-token',
      });
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('debe devolver true si el array de roles requeridos está vacío', () => {
      mockedJwt.verify.mockImplementation(() => mockPayload);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride');
      getAllAndOverrideSpy.mockReturnValue([]);

      const context = createMockContext({
        authorization: 'Bearer valid-token',
      });
      const result = guard.canActivate(context);
      expect(result).toBe(true);

      const request = context.switchToHttp().getRequest<RequestConUsuario>();
      expect(request.user).toEqual(mockPayload);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('debe extraer el token de un header Authorization Bearer válido', () => {
      const request = { headers: { authorization: 'Bearer my-token' } } as RequestConUsuario;
      const token = guard['extractTokenFromHeader'](request);
      expect(token).toBe('my-token');
    });

    it('debe retornar undefined si el header no existe', () => {
      const request = { headers: {} } as RequestConUsuario;
      const token = guard['extractTokenFromHeader'](request);
      expect(token).toBeUndefined();
    });

    it('debe retornar undefined si el tipo no es Bearer', () => {
      const request = { headers: { authorization: 'Basic token' } } as RequestConUsuario;
      const token = guard['extractTokenFromHeader'](request);
      expect(token).toBeUndefined();
    });
  });
});
