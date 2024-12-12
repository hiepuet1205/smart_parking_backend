import { Injectable } from '@nestjs/common';
import { RentRequestRepository } from '@shared/repository/rent-request.repository';
import { CreateRentRequestDto } from './dto/create-rent-request.dto';
import {
  dateFormat,
  getDateInGMT7,
  InpOrderAlreadyConfirmed,
  // IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
  Refund,
  VerifyReturnUrl,
  VnpLocale,
  VnpTransactionType,
} from 'vnpay';
import { vnpay } from '@config/vnpay';
import { RentRequestStatus } from './enum/rent-request-status.enum';
import { LoggerService } from '@logger/logger.service';
import { LocationServiceGrpc, UserServiceGrpc } from '@shared/grpc';
import { SendNotificationsRequest } from '@shared/grpc/protos/user/user';
import { ParkingSlotStatus } from './enum/parking-slot-status.enum';
import { In } from 'typeorm';
import { RentRequest } from './entities/rent-request.entity';
import { CronJob } from 'cron';

@Injectable()
export class RentRequestService {
  constructor(
    private readonly rentRequestRepository: RentRequestRepository,
    private readonly logger: LoggerService,
    private readonly locationService: LocationServiceGrpc,
    private readonly userService: UserServiceGrpc,
  ) {}

  async find(query: { status: RentRequestStatus[] }) {
    let whereConditions = [];

    if (query?.status?.length) {
      whereConditions = whereConditions.map((condition) => {
        return {
          ...condition,
          status: In(query.status),
        };
      });
    }

    const requets = await this.rentRequestRepository.find({
      where: whereConditions,
    });

    await Promise.all(
      requets.map(async (rentRequest) => {
        const slot = await this.locationService.getInfoSlot({
          id: rentRequest.slotId,
        });
        if (slot) {
          (rentRequest as any).slot = slot;
        }
      }),
    );
    return requets;
  }

  async getOne(userId: number, id: number) {
    const rent = await this.rentRequestRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    const slot = await this.locationService.getInfoSlot({
      id: rent.slotId,
    });
    if (slot) {
      (rent as any).slot = slot;
    }

    return rent;
  }

  async create(body: CreateRentRequestDto, userId: number) {
    const slot = await this.locationService.getInfoSlot({
      id: body.slotId,
    });

    if (!slot || slot.status !== ParkingSlotStatus.AVAILABLE) {
      throw new Error('Slot is not available');
    }

    await this.locationService.updateStatusSlot({
      id: body.slotId,
      status: ParkingSlotStatus.TEMP_UNAVAILABLE,
    });

    const rentRequest = await this.rentRequestRepository.save({
      ...body,
      userId,
      ownerId: slot.userId,
      coOwnerId: slot.coUserId,
    });
    return rentRequest;
  }

  async ipn(query: any) {
    this.logger.log(`ipn: ${JSON.stringify(query)}`);
    try {
      const verify: VerifyReturnUrl = vnpay.verifyIpnCall(query);
      // if (!verify.isVerified) {
      //   return IpnFailChecksum;
      // }

      // Tìm đơn hàng trong database của bạn
      const rentRequest = await this.rentRequestRepository.findOne({
        where: {
          txnRef: verify.vnp_TxnRef,
        },
      });

      // Nếu không tìm thấy đơn hàng hoặc mã đơn hàng không khớp
      if (!rentRequest) {
        return IpnOrderNotFound;
      }

      // Nếu số tiền thanh toán không khớp
      if (verify.vnp_Amount !== rentRequest.depositAmount) {
        return IpnInvalidAmount;
      }

      // Nếu đơn hàng đã được xác nhận trước đó
      if (rentRequest.status === RentRequestStatus.PAID) {
        return InpOrderAlreadyConfirmed;
      }

      /**
       * Sau khi xác thực đơn hàng hoàn tất,
       * bạn có thể cập nhật trạng thái đơn hàng trong database của bạn
       */
      rentRequest.status = RentRequestStatus.PAID;

      const slot = await this.locationService.getInfoSlot({
        id: rentRequest.slotId,
      });

      if (!slot || slot.status !== ParkingSlotStatus.TEMP_UNAVAILABLE) {
        throw new Error('Slot is not available');
      }

      await this.locationService.updateStatusSlot({
        id: rentRequest.slotId,
        status: ParkingSlotStatus.UNAVAILABLE,
      });

      await this.rentRequestRepository.save(rentRequest);

      try {
        await Promise.all([
          this.userService.sendNotifications({
            userIds: [rentRequest.userId],
            title: 'Order confirmed',
            body: `Request to rent slot ${slot.extractLocation} has been confirmed`,
          } as SendNotificationsRequest),
          this.userService.sendNotifications({
            userIds: [slot.userId, slot.coUserId],
            title: 'New rent request',
            body: `There is a confirmed request to lease slot ${slot.extractLocation}`,
          } as SendNotificationsRequest),
          this.userService.updateTotal({
            id: rentRequest.coOwnerId ?? rentRequest.ownerId,
            total: rentRequest.depositAmount.toString(),
          }),
        ]);
      } catch (error) {
        this.logger.error(`send notification error: ${error}`, error);
      }

      // Sau đó cập nhật trạng thái về cho VNPay biết rằng bạn đã xác nhận đơn hàng
      return IpnSuccess;
    } catch (error) {
      /**
       * Xử lí lỗi ngoại lệ
       * Ví dụ như không đủ dữ liệu, dữ liệu không hợp lệ, cập nhật database thất bại
       */
      this.logger.error(`verify error: ${error}`, error);
      return IpnUnknownError;
    }
  }

  async findAll(userId: number, query: { status: RentRequestStatus[] }) {
    let whereConditions = [
      {
        userId,
      },
      {
        coOwnerId: userId,
      },
      {
        ownerId: userId,
      },
    ];

    if (query?.status?.length) {
      whereConditions = whereConditions.map((condition) => {
        return {
          ...condition,
          status: In(query.status),
        };
      });
    }

    const requets = await this.rentRequestRepository.find({
      where: whereConditions,
    });

    await Promise.all(
      requets.map(async (rentRequest) => {
        const slot = await this.locationService.getInfoSlot({
          id: rentRequest.slotId,
        });
        if (slot) {
          (rentRequest as any).slot = slot;
        }
      }),
    );
    return requets;
  }

  async refund(vnp_RequestId: string, vnp_TransactionDate: Date, vnp_Amount: number, vnp_OrderInfo: string, vnp_TxnRef: string) {
    const refundRequestDate = dateFormat(getDateInGMT7(new Date(Date.now())));
    const orderCreatedAt = dateFormat(getDateInGMT7(vnp_TransactionDate));

    await vnpay.refund({
      vnp_Amount,
      vnp_CreateBy: 'smart parking',
      vnp_CreateDate: refundRequestDate,
      vnp_IpAddr: '127.0.0.1',
      vnp_OrderInfo,
      vnp_RequestId,
      vnp_TransactionDate: orderCreatedAt,
      vnp_TransactionType: VnpTransactionType.FULL_REFUND,
      vnp_TxnRef,
      vnp_Locale: VnpLocale.EN,
    } as Refund);
  }

  addCronJobChangeStatus(rentRequest: RentRequest) {
    const job = new CronJob(rentRequest.endTime, async () => {
      await this.locationService.updateStatusSlot({
        id: rentRequest.slotId,
        status: ParkingSlotStatus.AVAILABLE,
      });

      await this.rentRequestRepository.update(rentRequest.id, {
        status: RentRequestStatus.COMPLETED,
      });
    });

    job.start();
  }
}
