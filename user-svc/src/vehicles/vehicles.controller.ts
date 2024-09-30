import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@shared/validate_pipe/file-validation.pipe';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { User } from '@shared/decorators/user.decorator';

@UseGuards(JwtAccessTokenGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createVehicle(
    @User('user_id') userId: number,
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File,
  ) {
    return this.vehiclesService.createVehicle(userId, createVehicleDto, file);
  }

  @Get('')
  async getInfo(@User('user_id') userId: number) {
    return this.vehiclesService.getVehicles(userId);
  }

  @Get(':id')
  async getInfoById(@User('user_id') userId: number, @Param('id') id: number) {
    return this.vehiclesService.getVehicleById(userId, id);
  }

  @Delete(':id')
  async deleteVehicle(@User('user_id') userId: number, @Param('id') id: number) {
    return this.vehiclesService.deleteVehicle(userId, id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateVehicle(
    @User('user_id') userId: number,
    @Param('id') id: number,
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File,
  ) {
    return this.vehiclesService.updateVehicle(userId, id, createVehicleDto, file);
  }
}
