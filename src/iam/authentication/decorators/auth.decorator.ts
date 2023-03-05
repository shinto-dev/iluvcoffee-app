import { AuthType } from '../enums/auth-type.enum';
import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPES_KEY = 'auth';
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPES_KEY, authTypes);
