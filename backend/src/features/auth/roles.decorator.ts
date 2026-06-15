import { SetMetadata } from '@nestjs/common';
import { TipoRol } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TipoRol[]) => SetMetadata(ROLES_KEY, roles);
