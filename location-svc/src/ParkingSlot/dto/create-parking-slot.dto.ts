import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @IsNotEmpty()
  @IsString()
  extractLocation: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  priceHour: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  locationId: number;
}
