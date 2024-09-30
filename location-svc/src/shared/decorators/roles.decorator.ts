import { UserRole } from '@app.constant';
import { SetMetadata } from '@nestjs/common';

export const ROLES = 'roles';
export const Roles = (roles: UserRole[]) => SetMetadata(ROLES, roles);
