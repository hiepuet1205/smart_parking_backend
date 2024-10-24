import { Injectable } from '@nestjs/common';
import { Payment } from '@payment/entities/payment.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(private readonly dataSource: DataSource) {
    super(Payment, dataSource);
  }
}
