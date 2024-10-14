import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { RentRequest } from '@rent/entities/rent-request.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RentRequestRepository extends BaseRepository<RentRequest> {
  constructor(private readonly dataSource: DataSource) {
    super(RentRequest, dataSource);
  }
}
