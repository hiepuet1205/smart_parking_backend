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
import compare from 'fuzzy-comparison';
import { RentRequestStatus } from '@rent/enum/rent-request-status.enum';
import { SendNotificationsRequest } from '@shared/grpc/protos/user/user';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: Mqtt5Client;
  private isRetrying = false;

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
    this.client = new Mqtt5Client(builder);
    this.client.start();
    this.client.on('error', () => {
      this.logger.log('AWS IOT MQTT Connection error');
    });
    this.client.on('attemptingConnect', () => {
      this.logger.log('AWS IOT MQTT trying to Connect...');
    });
    this.client.on('connectionSuccess', () => {
      this.logger.log('AWS IOT MQTT Connection successfull');
      setInterval(async () => {
        const randomMessage = JSON.stringify({ message: 'Keep alive message', timestamp: new Date().toISOString() });
        await this.publishMessage('your/topic/here', randomMessage);
      }, 30000);
    });
    this.client.on('connectionFailure', (data) => {
      this.logger.log('AWS IOT MQTT Connection failed');
      this.logger.error(data.error.error_name, data.error.error_name);
    });
    this.client.on('disconnection', () => {
      this.logger.log('AWS IOT MQTT Connection disconnected');
    });
    const retryConnection = async () => {
      if (this.isRetrying) {
        return; // Không retry nếu đã trong quá trình retry
      }
      this.isRetrying = true;
      this.logger.error('Retrying connection in 5 seconds...', 'AWS IOT MQTT Connection error');
      setTimeout(async () => {
        try {
          await this.client.stop(); // Dừng client trước khi retry
          await this.client.start(); // Khởi động lại client
        } catch (error) {
          this.logger.error(`Retry failed: ${error.message}`, error.stack);
        } finally {
          this.isRetrying = false; // Reset cờ trạng thái
        }
      }, 5000);
    };
    this.client.on('connectionFailure', (data) => {
      this.logger.log('AWS IOT MQTT Connection failed');
      this.logger.error(data.error.error_name, data.error.error_name);
      retryConnection(); // Gọi hàm retry
    });
    this.client.on('messageReceived', async (eventData: MessageReceivedEvent) => {
      try {
        const payload = JSON.parse(new TextDecoder().decode(eventData.message.payload as ArrayBuffer));

        if (payload.status) {
          const rentRequest = await this.rentRequestRepository.findOne({
            where: {
              slotId: payload.slotId,
              status: RentRequestStatus.PAID,
            },
          });

          await this.userService.sendNotifications({
            userIds: [rentRequest.ownerId, rentRequest.coOwnerId],
            title: 'Status Slot',
            body: `There is a car moving into slot ${payload.slotId}`,
          } as SendNotificationsRequest);
        }

        this.logger.log(payload);

        const name = `${randomUUID()}.png`;
        const uploadResult = await this.fileService.uploadPublicFile(Buffer.from(payload.image, 'base64'), name);

        const result = await this.aiService.detectLicensePlate(uploadResult.Location);

        const rentRequest = await this.rentRequestRepository.findOne({
          where: {
            slotId: payload.slotId,
            status: RentRequestStatus.PAID,
          },
        });

        const vehicle = await this.userService.getVehicleInfo({
          id: rentRequest.vehicleId,
        });

        console.log(vehicle.licensePlates);

        const similarity = compare(vehicle.licensePlates, result.result.trim(), {
          threshold: 1,
        });
        console.log(similarity);
        console.log(result);

        // if (similarity) {
          await this.userService.sendNotifications({
            userIds: [rentRequest.userId],
            title: 'Car found in the slot you rented',
            body: `License plate: ${result.result.trim()}`,
            data: {
              image: uploadResult.Location,
              type: 'VEHICLE_FOUND',
              slotId: payload.slotId,
              plateNumber: result.result.trim(),
            },
          });
        // }
      } catch (error) {
        this.logger.error(error.message, error.stack);
      }
    });
    await this.client.subscribe({
      subscriptions: [{ qos: 1, topicFilter: 'esp32/pub' }],
    });
    return true;
  }
  async onModuleInit() {
    await this.mqttNew();
  }

  async publishMessage(topic: string, payload: string, qos: number = 1): Promise<void> {
    if (!this.client) {
      this.logger.error('MQTT Client is not initialized', 'AWS IOT MQTT Connection error');
      return;
    }

    try {
      await this.client.publish({
        qos,
        topicName: topic,
        payload,
      });
      this.logger.log(`Message published to ${topic}: ${payload}`);
    } catch (error) {
      this.logger.error(`Failed to publish message: ${error.message}`, error.stack);
    }
  }
}
