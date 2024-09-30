import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@users/enum/user-status.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}
