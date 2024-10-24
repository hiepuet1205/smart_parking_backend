import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from '@shared/repository/user.repository';
import { FileService } from '@shared/services/file.service';
import { UsersGrpcController } from './user.grpc.controller';
import { firebaseAdminProvider } from '@config/firbase';
import { NotificationService } from '@notification/notification.service';
import { LoggerService } from '@logger/logger.service';
import { PaymentRepository } from '@shared/repository/payment.repository';
import { WithdrawalRequestRepository } from '@shared/repository/withdrawal-request.repository';
import { HttpModule } from '@nestjs/axios';
import { VehicleRepository } from '@shared/repository/vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController, UsersGrpcController],
  providers: [
    UsersService,
    UserRepository,
    FileService,
    firebaseAdminProvider,
    NotificationService,
    LoggerService,
    PaymentRepository,
    WithdrawalRequestRepository,
    VehicleRepository,
  ],
})
export class UsersModule {}
