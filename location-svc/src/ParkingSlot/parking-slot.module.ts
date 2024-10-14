import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotRepository } from '@shared/repository/parking-slot.repository';
import { FileService } from '@shared/services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService, ParkingSlotRepository, FileService],
})
export class ParkingSlotModule {}
