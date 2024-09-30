import { BadRequestException, Injectable } from '@nestjs/common';
import { VehicleRepository } from '@shared/repository/vehicle.repository';
import { FileService } from '@shared/services/file.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly fileService: FileService,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async createVehicle(userId: number, createVehicleDto: CreateVehicleDto, file: Express.Multer.File) {
    const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);

    const data = await this.vehicleRepository.save({
      ...createVehicleDto,
      userId,
      image: uploadResult.Location,
    });

    return {
      status: 'success',
      message: 'Create successfully',
      data,
    };
  }

  async getVehicles(userId: number) {
    return await this.vehicleRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
  }

  async getVehicleById(userId: number, id: number) {
    const vehicle = await this.vehicleRepository.findOne({ where: { user: { id: userId }, id }, relations: ['user'] });

    if (!vehicle) throw new BadRequestException('Vehicle not found');

    return vehicle;
  }

  async deleteVehicle(userId: number, id: number) {
    const vehicle = await this.getVehicleById(userId, id);
    await this.vehicleRepository.remove(vehicle);
    return { status: 'success', message: 'Delete successfully' };
  }

  async updateVehicle(userId: number, id: number, createVehicleDto: CreateVehicleDto, file: Express.Multer.File) {
    const vehicle = await this.getVehicleById(userId, id);

    if (!vehicle) throw new BadRequestException('Vehicle not found');

    if (file) {
      const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);
      createVehicleDto.image = uploadResult.Location;
    }

    await this.vehicleRepository.update({ id }, createVehicleDto);

    return {
      status: 'success',
      message: 'Update successfully',
    };
  }
}
