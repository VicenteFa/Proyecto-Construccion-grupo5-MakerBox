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
export function isValidUsersResponse(data: any): data is IUsersResponse {
  if (!data || typeof data !== 'object' || !Array.isArray(data.users)) {
    return false;
  }

  return data.users.every((user: any) => {
    return (
      user &&
      typeof user === 'object' &&
      typeof user.id === 'string' &&
      typeof user.name === 'string' &&
      typeof user.age === 'number'
    );
  });
}
