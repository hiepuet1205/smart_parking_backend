import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @IsNotEmpty()
  @IsString()
  extractLocation: string;

  @IsNotEmpty()
  @IsNumber()
  priceHour: number;

  @IsNotEmpty()
  @IsInt()
  locationId: number;
}
