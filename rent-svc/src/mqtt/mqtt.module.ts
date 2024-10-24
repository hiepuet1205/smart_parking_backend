import { LoggerService } from '@logger/logger.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttService } from './mqtt.service';
import { FileService } from '@shared/services/file.service';
import { AiService } from '@shared/services/ai.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [LoggerService, MqttService, ConfigService, FileService, AiService],
})
export class MqttModule {}
