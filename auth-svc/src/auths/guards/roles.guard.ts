// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES } from '@shared/decorators/roles.decorator';
// import { RequestWithUser } from '@shared/interfaces/request.interface';
// import { UserRole } from '@users/enum/user-role.enum';
// import { Observable } from 'rxjs';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly refector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const roles: UserRole[] = this.refector.getAllAndOverride(ROLES, [context.getHandler(), context.getClass()]);
//     const request: RequestWithUser = context.switchToHttp().getRequest();
//     return roles.includes(request.user.role);
//   }
// }
