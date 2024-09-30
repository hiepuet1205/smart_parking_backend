import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '@shared/services/file.service';
import { UserServiceGrpc } from '@shared/grpc/services';
import { GrpcModule } from '@shared/grpc';

@Module({
  imports: [JwtModule.register({}), GrpcModule],
  controllers: [AuthsController],
  providers: [AuthsService, FileService, UserServiceGrpc],
})
export class AuthsModule {}
