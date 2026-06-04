import { Reserva } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ReservasService } from './reservas.service';

// Test para obtener todas las reservas de un rut especifico
describe('ReservasService - obtenerReservasPorRut', () => {
  let reservasService: ReservasService;
  let prismaServiceMock: {
    reserva: {
      findMany: jest.Mock<Promise<Reserva[]>, [unknown]>;
    };
  };

  beforeEach(() => {
    // Crear un mock sobre el PrismaService
    prismaServiceMock = {
      reserva: {
        findMany: jest.fn<Promise<Reserva[]>, [unknown]>(),
      },
    };

    // iniciar el servicio con el mock
    reservasService = new ReservasService(prismaServiceMock as unknown as PrismaService);
  });

  it('debe retornar todas las reservas para un rut exacto', async () => {
    // Datos del test
    const rutPrueba = '12345678-9';
    const reservasEsperadas: Reserva[] = [
      {
        idReserva: '1',
        fechaReserva: new Date('2026-06-10'),
        estadoReserva: 'PENDIENTE',
        solicitanteNombre: 'Juan',
        solicitanteApellido: 'Figueroa',
        solicitanteCorreo: 'juan@example.com',
        solicitanteRut: rutPrueba,
        refAyudante: '1',
        motivoReserva: 'Necesito usar el equipo',
        creadoEn: new Date(),
      },
      {
        idReserva: '2',
        fechaReserva: new Date('2026-06-11'),
        estadoReserva: 'CONFIRMADA',
        solicitanteNombre: 'Juan',
        solicitanteApellido: 'Figueroa',
        solicitanteCorreo: 'juan@example.com',
        solicitanteRut: rutPrueba,
        refAyudante: '2',
        motivoReserva: 'Otros',
        creadoEn: new Date(),
      },
    ];

    // Configurar el mock para retornar las reservas
    prismaServiceMock.reserva.findMany.mockResolvedValueOnce(reservasEsperadas);

    // Ejecutar el metodo
    const resultado = await reservasService.obtenerReservasPorRut(rutPrueba);

    // Verificaciones
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(reservasEsperadas);
    expect(prismaServiceMock.reserva.findMany).toHaveBeenCalledWith({
      where: {
        solicitanteRut: rutPrueba,
      },
    });
  });

  it('debe retornar un array vacio si no hay reservas para ese rut', async () => {
    const rutPrueba = '99999999-9';

    // Configurar el mock para retornar un array vacio
    prismaServiceMock.reserva.findMany.mockResolvedValueOnce([]);

    // Ejecutar el metodo
    const resultado = await reservasService.obtenerReservasPorRut(rutPrueba);

    // Verificaciones
    expect(resultado).toHaveLength(0);
    expect(resultado).toEqual([]);
    expect(prismaServiceMock.reserva.findMany).toHaveBeenCalledWith({
      where: {
        solicitanteRut: rutPrueba,
      },
    });
  });

  it('debe filtrar correctamente por rut cuando hay multiples ruts en la BD', async () => {
    const rutPrueba = '11111111-1';

    const reservasEsperadas: Reserva[] = [
      {
        idReserva: '3',
        fechaReserva: new Date('2026-06-12'),
        estadoReserva: 'PENDIENTE',
        solicitanteNombre: 'Carlos',
        solicitanteApellido: 'Garcia',
        solicitanteCorreo: 'carlos@example.com',
        solicitanteRut: rutPrueba,
        refAyudante: '1',
        motivoReserva: 'Mantenimiento',
        creadoEn: new Date(),
      },
    ];

    prismaServiceMock.reserva.findMany.mockResolvedValueOnce(reservasEsperadas);

    const resultado = await reservasService.obtenerReservasPorRut(rutPrueba);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].solicitanteRut).toBe(rutPrueba);
  });
});
