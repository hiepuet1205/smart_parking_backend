import { Body, Query, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@shared/decorators/user.decorator';
import { FileValidationPipe } from '@shared/validate_pipe/file-validation.pipe';
import { FormattedValidationPipe } from '@shared/validate_pipe/formatted-validation.pipe';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsService } from './locations.service';

@UseGuards(JwtAccessTokenGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('range')
  public async getRange(@Query() location: { lat: number; long: number; range: number }) {
    return await this.locationsService.getRange(location.lat, location.long, location.range);
  }

  @Get('/user')
  async getLocationsOfUser(@User('userId') userId: number) {
    return this.locationsService.getLocationsOfUser(userId);
  }

  @Get(':id')
  async getLocationById(@Param('id') id: number) {
    return this.locationsService.getLocationById(id);
  }

  @Get('')
  async getLocations() {
    return this.locationsService.getAllLocations();
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createLocation(
    @User('userId') userId: number,
    @Body(new FormattedValidationPipe('locations')) createLocationDto: CreateLocationDto,
    @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File,
  ) {
    return this.locationsService.createLocation(userId, createLocationDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateLocation(
    @User('userId') userId: number,
    @Param('id') id: number,
    @Body(new FormattedValidationPipe('locations')) createLocationDto: CreateLocationDto,
    @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File,
  ) {
    return this.locationsService.updateLocation(userId, id, createLocationDto, file);
  }

  @Delete(':id')
  async deleteLocation(@User('userId') userId: number, @Param('id') id: number) {
    return this.locationsService.deleteLocation(userId, id);
  }
}
