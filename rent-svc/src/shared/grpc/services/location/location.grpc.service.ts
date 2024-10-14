import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { LOCATION_PACKAGE_NAME, LocationServiceClient, UpdateStatusSlotRequest, UpdateStatusSlotResponse } from '@shared/grpc/protos/location/location';
import { firstValueFrom, catchError, throwError } from 'rxjs';

@Injectable()
export class LocationServiceGrpc implements OnModuleInit {
  private locationServiceClient: LocationServiceClient;

  constructor(@Inject(LOCATION_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.locationServiceClient = this.client.getService<LocationServiceClient>('LocationService');
  }

  async updateStatusSlot(request: UpdateStatusSlotRequest): Promise<UpdateStatusSlotResponse> {
    try {
      return await firstValueFrom(this.locationServiceClient.updateStatusSlot(request));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
