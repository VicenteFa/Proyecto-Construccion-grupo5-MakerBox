import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { describe, beforeEach, it, expect } from "@jest/globals";
import { TipoRol, Usuario } from "@prisma/client";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

// 1. Agregamos registrarProfesor al mock global
const mockAuthService = {
  registrarEstudiante: jest.fn(),
  registrarProfesor: jest.fn(),
  login: jest.fn(),
};

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      // 2. Usamos un solo array de providers limpio
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it("debe estar definido", () => {
    expect(controller).toBeDefined();
  });

  it("debería llamar al servicio para registrar un profesor", async () => {
    const mockDto = {
      rut: "11222333-4",
      nombre: "Test",
      apellido: "Profesor",
      correo: "test@universidad.cl",
      passUsuario: "123456",
    };

    const mockRespuesta = {
      idUsuario: "uuid-123",
      rut: mockDto.rut,
      nombre: mockDto.nombre,
      apellido: mockDto.apellido,
      correo: mockDto.correo,
      usuarioRol: TipoRol.PROFESOR,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    } as Usuario;

    const registrarProfesorSpy = jest
      .spyOn(service, "registrarProfesor")
      .mockResolvedValue(mockRespuesta);

    const resultado = await controller.registrarProfesor(mockDto);

    expect(resultado).toEqual(mockRespuesta);
    expect(registrarProfesorSpy).toHaveBeenCalledWith(mockDto);
  }); // 3. <--- ¡Faltaba esta línea para cerrar el test!

  describe("register", () => {
    it("debe registrar un estudiante exitosamente", async () => {
      const dto = {
        rut: "12345678-9",
        nombre: "Juan",
        apellido: "Perez",
        correo: "juan@utalca.cl",
        passUsuario: "password123",
      };
      const resultado = {
        idUsuario: "uuid-123",
        correo: dto.correo,
        usuarioRol: "ESTUDIANTE",
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      mockAuthService.registrarEstudiante.mockResolvedValue(resultado);

      const respuesta = await controller.register(dto);

      expect(respuesta).toEqual(resultado);
      expect(mockAuthService.registrarEstudiante).toHaveBeenCalledWith(dto);
    });

    it("debe lanzar ConflictException si el correo o RUT ya existen", async () => {
      const dto = {
        rut: "12345678-9",
        nombre: "Juan",
        apellido: "Perez",
        correo: "juan@utalca.cl",
        passUsuario: "password123",
      };
      mockAuthService.registrarEstudiante.mockRejectedValue(
        new ConflictException("El correo o RUT ya existen"),
      );

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("debe retornar un token JWT si las credenciales son correctas", async () => {
      const dto = { correo: "juan@utalca.cl", passUsuario: "password123" };
      const resultado = { token: "jwt-token-mock" };
      mockAuthService.login.mockResolvedValue(resultado);

      const respuesta = await controller.login(dto);

      expect(respuesta).toEqual(resultado);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it("debe lanzar UnauthorizedException si las credenciales son incorrectas", async () => {
      const dto = { correo: "juan@utalca.cl", passUsuario: "wrongpassword" };
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException("Credenciales incorrectas"),
      );

      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
