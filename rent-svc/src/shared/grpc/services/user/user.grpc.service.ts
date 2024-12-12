import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  GetVehicleInfoRequest,
  SendNotificationsRequest,
  UpdateTotalRequest,
  USER_PACKAGE_NAME,
  UserServiceClient,
} from '@shared/grpc/protos/user/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserServiceGrpc implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient = this.client.getService<UserServiceClient>('UserService');
  }

  async sendNotifications(request: SendNotificationsRequest): Promise<any> {
    try {
      return await firstValueFrom(this.userServiceClient.sendNotifications(request));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getVehicleInfo(request: GetVehicleInfoRequest): Promise<any> {
    try {
      return await firstValueFrom(this.userServiceClient.getVehicleInfo(request));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updateTotal(request: UpdateTotalRequest): Promise<any> {
    try {
      return await firstValueFrom(this.userServiceClient.updateTotal(request));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
