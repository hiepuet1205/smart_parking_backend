import { Body, Controller, Get, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@shared/validate_pipe/file-validation.pipe';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { User } from '@shared/decorators/user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddPaymentDto } from './dto/add-payment.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  @UseInterceptors(FileInterceptor('file'))
  async signUp(@Body() signUpDto: SignUpDto, @UploadedFile(new FileValidationPipe(['image/png', 'image/jpeg'])) file: Express.Multer.File) {
    return this.usersService.signUp(signUpDto, file);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('info')
  async getInfo(@User('id') userId: number) {
    return this.usersService.getInfo(userId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('')
  async getUser(@Query('email') email: string) {
    return this.usersService.getUser(email);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('add-device-token')
  async addDeviceToken(@User('id') userId: number, @Body() payload: { deviceToken: string }) {
    return this.usersService.addDeviceToken(userId, payload.deviceToken);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put('change-password')
  async changePassword(@User('id') userId: number, @Body() payload: ChangePasswordDto) {
    return this.usersService.changePassword(userId, payload);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('add-payment')
  async addPayment(@User('id') userId: number, @Body() payload: AddPaymentDto) {
    return this.usersService.addPayment(userId, payload);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('make-request-withdrawal')
  async makeRequestWithdrawal(@User('id') userId: number, @Body() payload: { amount: number }) {
    return this.usersService.makeRequestWithdrawal(userId, payload);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('withdrawal')
  async getWithdrawalRequests(@User('id') userId: number) {
    return this.usersService.getWithdrawalRequests(userId);
  }
}
