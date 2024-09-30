import { VehicleType } from '@vehicles/enum/vehicle-type.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  @IsNotEmpty()
  type: VehicleType;

  @IsNotEmpty()
  @IsString()
  licensePlates: string;

  image: string;
}
