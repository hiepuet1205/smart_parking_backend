import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingSlotRepository } from '@shared/repository/parking-slot.repository';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { AssignParkingSlotDto } from './dto/assign-parking-slot.dto';
import { ParkingSlotStatus } from './enum/parking-slot-status.enum';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { ILike } from 'typeorm';
import { FileService } from '@shared/services/file.service';

@Injectable()
export class ParkingSlotService {
  constructor(
    private readonly parkingSlotRepository: ParkingSlotRepository,
    private readonly fileService: FileService,
  ) {}

  async getParkingSlot(userId: number, locationId: number, keyword?: string) {
    if (!keyword)
      return await this.parkingSlotRepository.find({ where: { userId, location: { id: locationId } }, relations: ['location'] });

    return await this.parkingSlotRepository.find({
      where: { userId, location: { id: locationId }, extractLocation: ILike(`%${keyword}%`) },
      relations: ['location'],
    });
  }

  async getParkingSlotOfCoUser(userId: number, keyword?: string) {
    if (!keyword) return await this.parkingSlotRepository.find({ where: { coUserId: userId } });

    return await this.parkingSlotRepository.find({
      where: { coUserId: userId, extractLocation: ILike(`%${keyword}%`) },
    });
  }

  async getDetailParkingSlot(id: number) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id }, relations: ['location'] });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return parkingSlot;
  }

  async createParkingSlot(userId: number, createParkingSlotDto: CreateParkingSlotDto, file: Express.Multer.File) {
    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: { userId, extractLocation: createParkingSlotDto.extractLocation, location: { id: createParkingSlotDto.locationId } },
      relations: ['location'],
    });

    if (parkingSlot) throw new BadRequestException('Parking slot already exists');

    const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);

    return await this.parkingSlotRepository.save({
      ...createParkingSlotDto,
      userId,
      image: uploadResult.Location,
      location: { id: createParkingSlotDto.locationId },
    });
  }

  async assignParkingSlot(userId: number, id: number, assignParkingSlotDto: AssignParkingSlotDto) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, coUserId: assignParkingSlotDto.assigneeId });
  }

  async activeParkingSlot(userId: number, id: number) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, status: ParkingSlotStatus.AVAILABLE });
  }

  async inactiveParkingSlot(userId: number, id: number) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id, userId } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    return await this.parkingSlotRepository.save({ ...parkingSlot, status: ParkingSlotStatus.UNAVAILABLE });
  }

  async updateParkingSlot(userId: number, id: number, updateParkingSlotDto: UpdateParkingSlotDto, file: Express.Multer.File) {
    const parkingSlot = await this.parkingSlotRepository.findOne({ where: { id } });
    if (!parkingSlot) throw new BadRequestException('Parking slot not found');

    if (file) {
      const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);
      return await this.parkingSlotRepository.save({ ...parkingSlot, ...updateParkingSlotDto, image: uploadResult.Location });
    }

    return await this.parkingSlotRepository.save({ ...parkingSlot, ...updateParkingSlotDto });
  }
}
