import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Location } from '@locations/entities/location.entity';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  constructor(private readonly dataSource: DataSource) {
    super(Location, dataSource);
  }
}
