import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@shared/repository/user.repository';
import { FileService } from '@shared/services/file.service';
import { SignUpDto } from './dto/create-user.dto';
import { UserStatus } from './enum/user-status.enum';
import * as bcrypt from 'bcryptjs';
import { UserSerialize } from '@shared/serialize/user.serialize';
import {
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  GetVehicleInfoRequest,
  SendNotificationsRequest,
} from '@protos/user/user';
import { NotificationService } from '@notification/notification.service';
import { DataSource, In } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Payment } from '@payment/entities/payment.entity';
import { AddPaymentDto } from './dto/add-payment.dto';
import { User } from './entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as CryptoJS from 'crypto-js';
import { PaymentRepository } from '@shared/repository/payment.repository';
import { WithdrawalRequestRepository } from '@shared/repository/withdrawal-request.repository';
import { WithdrawalRequest } from '@withdrawal-request/entities/withdrawal-request.entity';
import { WithdrawalRequestStatus } from '@withdrawal-request/enums/withdrawal-request-status.enum';
import { LoggerService } from '@logger/logger.service';
import { VehicleRepository } from '@shared/repository/vehicle.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly paymentRepository: PaymentRepository,
    private readonly withdrawalRequestRepository: WithdrawalRequestRepository,
    private readonly logger: LoggerService,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async getVehicleInfo(request: GetVehicleInfoRequest) {
    return await this.vehicleRepository.findOne({ where: { id: request.id } });
  }

  async signUp(signUpDto: SignUpDto, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { email: signUpDto.email } });

    if (user) throw new BadRequestException('Email already exists');

    let uploadResult;

    if (file) {
      uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);
    }

    const data = await this.usersRepository.save({
      ...signUpDto,
      avatar: uploadResult?.Location ?? null,
      role: signUpDto.role,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash(signUpDto.password, 10),
    });

    const serializerData = new UserSerialize(data).perform();
    return {
      status: 'success',
      message: 'Sign Up successfully',
      data: serializerData,
    };
  }

  async getUserById(_request: GetUserByIdRequest) {
    return {
      user: await this.usersRepository.findOne({ where: { id: _request.id } }),
    } as unknown as GetUserByIdResponse;
  }

  async getUserByEmail(_request: GetUserByEmailRequest) {
    return {
      user: await this.usersRepository.findOne({ where: { email: _request.email } }),
    } as unknown as GetUserByEmailResponse;
  }

  async getInfo(userId: number) {
    return await this.usersRepository.findOne({ where: { id: userId }, relations: ['vehicles', 'payment'] });
  }

  async getUser(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('Email not found');
    return user;
  }

  async sendNotifications(payload: SendNotificationsRequest) {
    const user = await this.usersRepository.find({
      where: {
        id: In(payload.userIds),
      },
    });

    const deviceIds = user.reduce((acc, item) => {
      if (item.firebaseDeviceTokens) {
        acc.push(...item.firebaseDeviceTokens);
      }
      return acc;
    }, [] as string[]);

    await this.notificationService.sendNotificationToMultipleDevices({
      title: payload.title,
      body: payload.body,
      deviceIds,
      data: payload.data,
    });
  }

  async addDeviceToken(userId: number, deviceToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.firebaseDeviceTokens) {
      user.firebaseDeviceTokens = [];
    }

    if (!user.firebaseDeviceTokens.includes(deviceToken)) {
      user.firebaseDeviceTokens.push(deviceToken);
      await this.usersRepository.save(user);
    }

    return {
      status: 'success',
      message: 'Device token added successfully',
    };
  }

  async changePassword(userId: number, payload: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(payload.oldPassword, user.password))) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(payload.newPassword, 10);
    await this.usersRepository.save(user);
    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  async addPayment(userId: number, payload: AddPaymentDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['payment'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.payment) {
      const payment = await this.paymentRepository.save({
        ...payload,
      });

      user.payment = payment;
      await this.usersRepository.save(user);
    } else {
      const payment = {
        ...user.payment,
        ...payload,
      };

      await this.paymentRepository.save(payment);
    }

    return {
      status: 'success',
      message: 'Payment added successfully',
    };
  }

  async makeRequestWithdrawal(userId: number, payload: { amount: number }) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['payment'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.payment) {
      throw new NotFoundException('Payment not found');
    }

    if (user.total < payload.amount) {
      throw new NotFoundException('Insufficient balance');
    }

    const withdrawalRequest = await this.withdrawalRequestRepository.save({
      user,
      amount: payload.amount,
    });

    await this.dataSource.transaction(async (manager) => {
      try {
        const userRepository = manager.getRepository(User);
        const withdrawalRequestRepository = manager.getRepository(WithdrawalRequest);

        await this.transferMoney(user.payment, payload.amount);
        user.total -= payload.amount;
        user.totalAmountWithdraw += payload.amount;
        await Promise.all([
          userRepository.save(user),
          withdrawalRequestRepository.update(withdrawalRequest.id, { status: WithdrawalRequestStatus.SUCCESS }),
        ]);
      } catch (error) {
        this.logger.error(error, 'Withdrawal request failed');
        await this.withdrawalRequestRepository.update(withdrawalRequest.id, { status: WithdrawalRequestStatus.ERROR });
      }
    });
    return {
      status: 'success',
      message: 'Withdrawal request sent successfully',
    };
  }

  async transferMoney(payment: Payment, amount: number) {
    const partnerRefId = this.generateRandomString(9);

    const data: any = {
      bankCode: 'APPOTA_TEST',
      accountNo: '9704000000000018',
      accountType: 'card',
      amount,
      accountName: 'AP APPOTAPAY',
      partnerRefId,
      message: 'Test transfer payment',
      feeType: 'payer',
    };

    const signature = this.generateSignature(data);
    data.signature = signature;

    const url = 'https://gateway.dev.appotapay.com/api/v1/service/transfer/make';
    const response = await firstValueFrom(this.httpService.post(url, data));

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message);
    }
  }

  generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  generateSignature(requestBody) {
    const partnerSecretKey = '';

    requestBody = this.ksort(requestBody);
    let signData = '';
    for (const [key, value] of Object.entries(requestBody)) {
      if (key !== 'signature') signData += `&${key}=${value}`;
    }
    signData = signData.substring(1);

    return CryptoJS.HmacSHA256(signData, partnerSecretKey).toString();
  }

  ksort(obj) {
    const keys = Object.keys(obj).sort(),
      sortedObj = {};

    // eslint-disable-next-line guard-for-in
    for (const i in keys) {
      sortedObj[keys[i]] = obj[keys[i]];
    }

    return sortedObj;
  }

  async getWithdrawalRequests(userId: number) {
    return await this.withdrawalRequestRepository.find({ where: { user: { id: userId } } });
  }
}
