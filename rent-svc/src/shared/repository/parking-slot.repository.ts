import { ParkingSlot } from '@ParkingSlot/entity/parking-slot.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ParkingSlotRepository extends BaseRepository<ParkingSlot> {
  constructor(private readonly dataSource: DataSource) {
    super(ParkingSlot, dataSource);
  }
}
