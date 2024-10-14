import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateParkingSlotDto {
  @IsOptional()
  @IsString()
  extractLocation: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceHour: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  locationId: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  coUserId: number;
}
