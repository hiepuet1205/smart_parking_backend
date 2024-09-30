import { OmitType } from '@nestjs/swagger';
import { CreateParkingSlotDto } from './create-parking-slot.dto';

export class UpdateParkingSlotDto extends OmitType(CreateParkingSlotDto, ['locationId']) {}
