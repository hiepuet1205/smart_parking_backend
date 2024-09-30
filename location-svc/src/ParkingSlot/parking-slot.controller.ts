import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { ParkingSlotService } from './parking-slot.service';
import { UserRole } from '@app.constant';
import { FormattedValidationPipe } from '@shared/validate_pipe/formatted-validation.pipe';
import { User } from '@shared/decorators/user.decorator';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { AssignParkingSlotDto } from './dto/assign-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { Roles } from '@shared/decorators/roles.decorator';

@UseGuards(JwtAccessTokenGuard)
@Controller('parking-slots')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Roles([UserRole.OWNER_PARKING_LOT])
  @Post('')
  async createParkingSlot(
    @User('userId') userId: number,
    @Body(new FormattedValidationPipe('parking-slots')) createParkingSlotDto: CreateParkingSlotDto,
  ) {
    return await this.parkingSlotService.createParkingSlot(userId, createParkingSlotDto);
  }

  @Roles([UserRole.OWNER_PARKING_LOT])
  @Put('assign/:id')
  async assignParkingSlot(
    @User('userId') userId: number,
    @Param('id') id: number,
    @Body(new FormattedValidationPipe('parking-slots')) assignParkingSlotDto: AssignParkingSlotDto,
  ) {
    return await this.parkingSlotService.assignParkingSlot(userId, id, assignParkingSlotDto);
  }

  @Roles([UserRole.OWNER_PARKING_LOT, UserRole.OWNER_PARKING_SLOT])
  @Put('active/:id')
  async activeParkingSlot(@User('userId') userId: number, @Param('id') id: number) {
    return await this.parkingSlotService.activeParkingSlot(userId, id);
  }

  @Roles([UserRole.OWNER_PARKING_LOT, UserRole.OWNER_PARKING_SLOT])
  @Put('inactive/:id')
  async inactiveParkingSlot(@User('userId') userId: number, @Param('id') id: number) {
    return await this.parkingSlotService.inactiveParkingSlot(userId, id);
  }

  @Roles([UserRole.OWNER_PARKING_LOT, UserRole.OWNER_PARKING_SLOT])
  @Put(':id')
  async updateParkingSlot(
    @User('userId') userId: number,
    @Param('id') id: number,
    @Body(new FormattedValidationPipe('parking-slots')) updateParkingSlotDto: UpdateParkingSlotDto,
  ) {
    return await this.parkingSlotService.updateParkingSlot(userId, id, updateParkingSlotDto);
  }
}
