import { Controller, UsePipes } from '@nestjs/common';
import { LocationServiceControllerMethods } from '@protos/location/location';
import { FormattedValidationPipe } from '@shared/validate_pipe/formatted-validation.pipe';
import { LocationsService } from './locations.service';
import { UpdateStatusSlotDto } from './dto/update-status-slot.dto';

@LocationServiceControllerMethods()
@Controller()
export class UsersGrpcController {
  constructor(private readonly locationsService: LocationsService) {}

  @UsePipes(new FormattedValidationPipe('location'))
  async updateStatusSlot(request: UpdateStatusSlotDto) {
    return await this.locationsService.updateStatusSlot(request);
  }
}
