import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { ParkingSlotService } from './parking-slot.service';
import { UserRole } from '@app.constant';
import { FormattedValidationPipe } from '@shared/validate_pipe/formatted-validation.pipe';
import { User } from '@shared/decorators/user.decorator';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { Roles } from '@shared/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@shared/validate_pipe/file-validation.pipe';

@UseGuards(JwtAccessTokenGuard)
@Controller('parking-slots')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Roles([UserRole.OWNER_PARKING_LOT])
  @Get('slot/:id')
  async getDetailParkingSlot(@Param('id') id: number) {
    return await this.parkingSlotService.getDetailParkingSlot(id);
  }

  @Roles([UserRole.OWNER_PARKING_LOT])
  @Get(':locationId')
  async getParkingSlot(@User('userId') userId: number, @Param('locationId') locationId: number, @Query('keyword') keyword?: string) {
    return await this.parkingSlotService.getParkingSlot(userId, locationId, keyword);
  }

  @Roles([UserRole.OWNER_PARKING_SLOT])
  @Get('')
  async getParkingSlotOfCoUser(@User('userId') userId: number, @Query('keyword') keyword?: string) {
    return await this.parkingSlotService.getParkingSlotOfCoUser(userId, keyword);
  }

  @Roles([UserRole.OWNER_PARKING_LOT])
  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  async createParkingSlot(
    @User('userId') userId: number,
    @Body(new FormattedValidationPipe('parking-slots')) createParkingSlotDto: CreateParkingSlotDto,
    @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File,
  ) {
    return await this.parkingSlotService.createParkingSlot(userId, createParkingSlotDto, file);
  }

  @Roles([UserRole.OWNER_PARKING_LOT, UserRole.OWNER_PARKING_SLOT])
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async updateParkingSlot(
    @User('userId') userId: number,
    @Param('id') id: number,
    @Body(new FormattedValidationPipe('parking-slots')) updateParkingSlotDto: UpdateParkingSlotDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.parkingSlotService.updateParkingSlot(userId, id, updateParkingSlotDto, file);
  }
}
