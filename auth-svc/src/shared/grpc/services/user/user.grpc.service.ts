import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { GetUserByEmailRequest, GetUserByIdRequest, USER_PACKAGE_NAME, UserServiceClient } from '@shared/grpc/protos/user/user';
import { firstValueFrom, catchError, throwError } from 'rxjs';

@Injectable()
export class UserServiceGrpc implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient = this.client.getService<UserServiceClient>('UserService');
  }

  getUserById(request: GetUserByIdRequest) {
    return firstValueFrom(
      this.userServiceClient.getUserById(request).pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  getUserByEmail(request: GetUserByEmailRequest) {
    return firstValueFrom(
      this.userServiceClient.getUserByEmail(request).pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
