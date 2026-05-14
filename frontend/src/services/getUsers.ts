import usersMock from '../mocks/users.json';

export type IUser = {
  id: string;
  name: string;
  age: number;
};

/**
 * Lo que debe retornar getUsers
 */
export type IUsersResponse = {
  users: IUser[];
};

export const getUsers = async (): Promise<IUsersResponse> => {
  // simula el retorno de una API.
  return new Promise((resolve) => {
    resolve(usersMock as IUsersResponse);
  });
};

/**
 * Verifica que el param data sea igual a -> { users: IUser[] }
 */
export const isValidUsersResponse = (data: unknown): data is IUsersResponse => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.users)) {
    return false;
  }

  return obj.users.every((user: unknown) => {
    if (!user || typeof user !== 'object') {
      return false;
    }

    const u = user as Record<string, unknown>;

    return typeof u.id === 'string' && typeof u.name === 'string' && typeof u.age === 'number';
  });
};
