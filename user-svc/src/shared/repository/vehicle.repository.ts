import { Injectable } from '@nestjs/common';
import { Vehicle } from '@vehicles/entity/vehicle.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class VehicleRepository extends BaseRepository<Vehicle> {
  constructor(private readonly dataSource: DataSource) {
    super(Vehicle, dataSource);
  }
}
