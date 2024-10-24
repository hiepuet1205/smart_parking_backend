import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationRepository } from '@shared/repository/location.repository';
import { FileService } from '@shared/services/file.service';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { GoongService } from '@shared/services/goong.service';
import { Location } from '@locations/entities/location.entity';
import { ParkingSlotRepository } from '@shared/repository/parking-slot.repository';
import { HttpModule } from '@nestjs/axios';
import { LocationsGrpcController } from './location.grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), HttpModule],
  controllers: [LocationsController, LocationsGrpcController],
  providers: [LocationsService, LocationRepository, FileService, GoongService, ParkingSlotRepository],
})
export class LocationsModule {}
