import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingSlotRepository } from '@shared/repository/parking-slot.repository';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { AssignParkingSlotDto } from './dto/assign-parking-slot.dto';
import { ParkingSlotStatus } from './enum/parking-slot-status.enum';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';

@Injectable()
export class ParkingSlotService {
  constructor(private readonly parkingSlotRepository: ParkingSlotRepository) {}

  async createParkingSlot(userId: number, createParkingSlotDto: CreateParkingSlotDto) {
    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: { userId, extractLocation: createParkingSlotDto.extractLocation, location: { id: createParkingSlotDto.locationId } },
      relations: ['location'],
    });

    if (parkingSlot) throw new BadRequestException('Parking slot already exists');

    return await this.parkingSlotRepository.save({ ...createParkingSlotDto, userId });
  }

  async assignParkingSlot(userId: number, id: number, assignParkingSlotDto: AssignParkingSlotDto) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, userId: assignParkingSlotDto.assigneeId });
  }

  async activeParkingSlot(userId: number, id: number) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, status: ParkingSlotStatus.AVAILABLE });
  }

  async inactiveParkingSlot(userId: number, id: number) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, status: ParkingSlotStatus.NOT_AVAILABLE });
  }

  async updateParkingSlot(userId: number, id: number, updateParkingSlotDto: UpdateParkingSlotDto) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, ...updateParkingSlotDto });
  }
}
