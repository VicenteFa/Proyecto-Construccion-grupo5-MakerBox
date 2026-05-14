import { describe, it, expect } from 'vitest';
import { getUsers, isValidUsersResponse } from './services/getUsers';

describe('Modulo auth de Usuarios', () => {
  // Prueba individual, obtener usuarios
  it('debe obtener los usuarios (mocks)', async () => {
    const users = await getUsers();
    expect(isValidUsersResponse(users)).toBe(true);
    expect(users.users.length).toBeGreaterThan(0);
  });
});
