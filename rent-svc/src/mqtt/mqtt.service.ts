import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import { MessageReceivedEvent, Mqtt5Client } from 'aws-crt/dist/native/mqtt5';
import { AwsIotMqtt5ClientConfigBuilder } from 'aws-crt/dist/native/aws_iot_mqtt5';
import { FileService } from '@shared/services/file.service';
import { randomUUID } from 'crypto';
import { AiService } from '@shared/services/ai.service';
import { LoggerService } from '@logger/logger.service';
import { RentRequestRepository } from '@shared/repository/rent-request.repository';
import { UserServiceGrpc } from '@shared/grpc';
import { SendNotificationsRequest } from 'dist/protos/user/user';
import FuzzySet from 'fuzzyset.js';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(
    private readonly fileService: FileService,
    private readonly aiService: AiService,
    private readonly logger: LoggerService,
    private readonly rentRequestRepository: RentRequestRepository,
    private readonly userService: UserServiceGrpc,
  ) {}

  async mqttNew() {
    const endpoint = 'a26xtunwccf7tn-ats.iot.ap-southeast-1.amazonaws.com';
    const cert = path.resolve(__dirname, '../certs/217c88dab6067ac76915cd5225e31968ab12f208d768ab93169cea5408bae80c-certificate.pem.crt');
    const key = path.resolve(__dirname, '../certs/217c88dab6067ac76915cd5225e31968ab12f208d768ab93169cea5408bae80c-private.pem.key');
    const builder = AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(endpoint, cert, key).build();
    const client: Mqtt5Client = new Mqtt5Client(builder);
    client.start();
    client.on('error', () => {
      this.logger.log('AWS IOT MQTT Connection error');
    });
    client.on('attemptingConnect', () => {
      this.logger.log('AWS IOT MQTT trying to Connect...');
    });
    client.on('connectionSuccess', () => {
      this.logger.log('AWS IOT MQTT Connection successfull');
    });
    client.on('connectionFailure', (data) => {
      this.logger.log('AWS IOT MQTT Connection failed');
      this.logger.error(data.error.error_name, data.error.error_name);
    });
    client.on('disconnection', () => {
      this.logger.log('AWS IOT MQTT Connection disconnected');
    });
    client.on('messageReceived', async (eventData: MessageReceivedEvent) => {
      const payload = JSON.parse(new TextDecoder().decode(eventData.message.payload as ArrayBuffer));

      this.logger.log(payload);

      const name = `${randomUUID()}.png`;

      try {
        const uploadResult = await this.fileService.uploadPublicFile(Buffer.from(payload.image, 'base64'), name);

        const result = await this.aiService.detectLicensePlate(uploadResult.Location);

        const rentRequest = await this.rentRequestRepository.findOne({
          where: {
            slotId: payload.slotId,
          },
        });

        const vehicle = await this.userService.getVehicleInfo({
          id: payload.vehicleId,
        });

        const fuzzy = FuzzySet();
        fuzzy.add(vehicle.licensePlates);

        const matches = fuzzy.get(result.result.trim());

        if (matches && matches[0][0] > 0.9) {
          await this.userService.sendNotifications({
            userIds: [rentRequest.userId],
            title: 'Phát hiện có xe tại slot bạn đã thuê',
            body: `Biển số: ${result.result.trim()}`,
          } as SendNotificationsRequest);
        }
      } catch (error) {
        console.log(error);
        this.logger.error(error.message, error.stack);
      }
    });
    await client.subscribe({
      subscriptions: [{ qos: 1, topicFilter: 'esp32/pub' }],
    });
    return true;
  }
  async onModuleInit() {
    await this.mqttNew();
  }
}
