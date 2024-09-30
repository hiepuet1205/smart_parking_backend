import { UserRole } from '@users/enum/user-role.enum';
import { UserStatus } from '@users/enum/user-status.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
