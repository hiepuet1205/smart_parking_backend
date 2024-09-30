import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from '@shared/repository/user.repository';
import { FileService } from '@shared/services/file.service';
import { UsersGrpcController } from './user.grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, UsersGrpcController],
  providers: [UsersService, UserRepository, FileService],
})
export class UsersModule {}
