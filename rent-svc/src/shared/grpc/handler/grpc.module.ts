import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '../protos/location/user';

export const loader = {
  longs: String,
  enums: String,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: false,
};

@Module({
  imports: [],
  providers: [
    {
      provide: USER_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../protos/user/user.proto'),
            loader,
            url: configService.get('userGrpcUrl'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [USER_PACKAGE_NAME],
})
export class GrpcModule {}
