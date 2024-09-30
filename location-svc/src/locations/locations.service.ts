import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from '@shared/repository/location.repository';
import { FileService } from '@shared/services/file.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GoongService } from '@shared/services/goong.service';

@Injectable()
export class LocationsService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly fileService: FileService,
    private readonly goongService: GoongService,
  ) {}

  async createLocation(userId: number, createLocationDto: CreateLocationDto, file: Express.Multer.File) {
    const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);

    const place = await this.goongService.getPlaceDetailById(createLocationDto.placeId);
    if (!place) throw new NotFoundException('Place not found');

    const location = await this.locationRepository.save({
      name: createLocationDto.name,
      location: place.result.name,
      long: place.result.geometry.location.lng,
      lat: place.result.geometry.location.lat,
      userId,
      image: uploadResult.Location,
    });
    return {
      status: 'success',
      message: 'Create successfully',
      data: location,
    };
  }

  async updateLocation(userId: number, id: number, updateLocationDto: UpdateLocationDto, file: Express.Multer.File) {
    const location = await this.locationRepository.findOne({ where: { id, userId } });

    if (!location) throw new NotFoundException('Location not found');

    if (file) {
      const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);
      updateLocationDto.image = uploadResult.Location;
    }

    const place = await this.goongService.getPlaceDetailById(updateLocationDto.placeId);
    if (!place) throw new NotFoundException('Place not found');

    await this.locationRepository.update(id, {
      name: updateLocationDto.name,
      location: place.result.name,
      long: place.result.geometry.location.lng,
      lat: place.result.geometry.location.lat,
      userId,
    });

    return {
      status: 'success',
      message: 'Update successfully',
    };
  }

  async getLocationsOfUser(userId: number) {
    return await this.locationRepository.find({ where: { userId } });
  }

  async getLocationById(id: number) {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async getAllLocations() {
    return await this.locationRepository.find();
  }

  async deleteLocation(userId: number, id: number) {
    const location = await this.locationRepository.findOne({ where: { id, userId } });
    if (!location) throw new NotFoundException('Location not found');

    await this.locationRepository.delete(id);
    return {
      status: 'success',
      message: 'Delete successfully',
    };
  }
}
