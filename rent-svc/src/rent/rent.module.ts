import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentRequest } from './entities/rent-request.entity';
import { RentRequestsController } from './rent.controller';
import { RentRequestRepository } from '@shared/repository/rent-request.repository';
import { RentRequestService } from './rent.service';
import { GrpcModule, LocationServiceGrpc, UserServiceGrpc } from '@shared/grpc';
import { LoggerService } from '@logger/logger.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([RentRequest]), GrpcModule],
  controllers: [RentRequestsController],
  providers: [RentRequestService, RentRequestRepository, UserServiceGrpc, LocationServiceGrpc, LoggerService, SchedulerRegistry],
})
export class RentRequestsModule {}
