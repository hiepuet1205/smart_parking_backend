import { Controller, UsePipes } from '@nestjs/common';
import {
  GetUserByEmailRequest,
  GetUserByIdRequest,
  GetVehicleInfoRequest,
  SendNotificationsRequest,
  UserServiceControllerMethods,
} from '@protos/user/user';
import { UsersService } from './users.service';
import { FormattedValidationPipe } from '@shared/validate_pipe/formatted-validation.pipe';

@UserServiceControllerMethods()
@Controller()
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new FormattedValidationPipe('users'))
  async getUserById(request: GetUserByIdRequest) {
    return await this.usersService.getUserById(request);
  }

  @UsePipes(new FormattedValidationPipe('users'))
  async getUserByEmail(request: GetUserByEmailRequest) {
    return await this.usersService.getUserByEmail(request);
  }

  async sendNotifications(request: SendNotificationsRequest) {
    return await this.usersService.sendNotifications(request);
  }

  async getVehicleInfo(request: GetVehicleInfoRequest) {
    return await this.usersService.getVehicleInfo(request);
  }
}
