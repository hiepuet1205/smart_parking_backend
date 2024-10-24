import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { sendNotificationDTO } from './dto/send-notification.dto';
import { LoggerService } from '@logger/logger.service';

@Injectable()
export class NotificationService {
  constructor(private readonly logger: LoggerService) {}

  async sendNotificationToMultipleDevices(payload: sendNotificationDTO) {
    try {
      const response = await firebase.messaging().sendEachForMulticast({
        tokens: payload.deviceIds,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
            },
          },
        },
      });
      this.logger.log(`Thông báo được gửi thành công: ${response.successCount} thiết bị.`);
      this.logger.log(`Số thiết bị gửi thất bại: ${response.failureCount}`);

      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(payload.deviceIds[idx]);
          }
        });
        this.logger.log('Các token không hợp lệ:', failedTokens.join(', '));
      }

      return response;
    } catch (error) {
      this.logger.error('Lỗi khi gửi thông báo:', error);
      throw new Error('Không thể gửi thông báo');
    }
  }
}
