import { LoggerService } from '@logger/logger.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttService } from './mqtt.service';
import { FileService } from '@shared/services/file.service';
import { AiService } from '@shared/services/ai.service';
import { HttpModule } from '@nestjs/axios';
import { RentRequestRepository } from '@shared/repository/rent-request.repository';
import { GrpcModule, UserServiceGrpc } from '@shared/grpc';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [HttpModule, GrpcModule],
  controllers: [MqttController],
  providers: [LoggerService, MqttService, ConfigService, FileService, AiService, RentRequestRepository, UserServiceGrpc],
})
export class MqttModule {}
