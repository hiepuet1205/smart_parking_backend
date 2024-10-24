import { Injectable } from '@nestjs/common';
import { WithdrawalRequest } from '@withdrawal-request/entities/withdrawal-request.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class WithdrawalRequestRepository extends BaseRepository<WithdrawalRequest> {
  constructor(private readonly dataSource: DataSource) {
    super(WithdrawalRequest, dataSource);
  }
}
