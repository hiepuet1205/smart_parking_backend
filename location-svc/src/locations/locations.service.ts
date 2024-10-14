import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from '@shared/repository/location.repository';
import { FileService } from '@shared/services/file.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GoongService } from '@shared/services/goong.service';
import { In, Point } from 'typeorm';
import { ParkingSlotRepository } from '@shared/repository/parking-slot.repository';
import { ParkingSlotStatus } from '@ParkingSlot/enum/parking-slot-status.enum';
import { UpdateStatusSlotDto } from './dto/update-status-slot.dto';

@Injectable()
export class LocationsService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly fileService: FileService,
    private readonly goongService: GoongService,
    private readonly parkingSlotRepository: ParkingSlotRepository,
  ) {}

  async createLocation(userId: number, createLocationDto: CreateLocationDto, file: Express.Multer.File) {
    const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);

    const place = await this.goongService.getPlaceDetailById(createLocationDto.placeId);
    if (!place) throw new NotFoundException('Place not found');

    const pointObject: Point = {
      type: 'Point',
      coordinates: [place.result.geometry.location.lng, place.result.geometry.location.lat],
    };

    const location = await this.locationRepository.save({
      name: createLocationDto.name,
      location: place.result.name,
      long: place.result.geometry.location.lng,
      lat: place.result.geometry.location.lat,
      userId,
      image: uploadResult.Location,
      point: pointObject,
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

  public async getRange(lat: number, long: number, range: number = 1000) {
    const origin = {
      type: 'Point',
      coordinates: [long, lat],
    };
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .select([
        '*',
        'location.point AS point',
        'ST_Distance(point, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(point)))/1000 AS distance',
      ])
      .where('ST_DWithin(point, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(point)) ,:range)')
      .orderBy('distance', 'ASC')
      .setParameters({
        origin: JSON.stringify(origin),
        range: range * 1000,
      })
      .getRawMany();

    const slots = await this.parkingSlotRepository.find({
      where: {
        location: {
          id: In(locations.map((location) => location.id)),
        },
        status: ParkingSlotStatus.AVAILABLE,
      },
      relations: ['location'],
    });

    locations.forEach((location) => {
      location.slots = slots
        .filter((slot) => slot.location.id === location.id)
        .map((slot) => {
          return { ...slot, location: location.id };
        });
      location.minPrice = location?.slots?.sort((a, b) => a.priceHour - b.priceHour)[0]?.priceHour || 0;
    });
    return locations;
  }

  async updateStatusSlot(request: UpdateStatusSlotDto) {
    return await this.parkingSlotRepository.update(request.id, {
      status: request.status,
    });
  }
}
