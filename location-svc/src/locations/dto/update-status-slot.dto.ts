import { ParkingSlotStatus } from '@ParkingSlot/enum/parking-slot-status.enum';

export class UpdateStatusSlotDto {
  id: number;
  status: ParkingSlotStatus;
}
