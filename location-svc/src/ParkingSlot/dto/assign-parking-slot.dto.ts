import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignParkingSlotDto {
  @IsInt()
  @IsNotEmpty()
  assigneeId: number;
}
