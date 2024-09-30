import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@shared/validate_pipe/file-validation.pipe';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { User } from '@shared/decorators/user.decorator';

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
  async getInfo(@User('user_id') userId: number) {
    return this.usersService.getInfo(userId);
  }
}
