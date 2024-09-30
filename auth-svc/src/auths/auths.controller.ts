import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthsService } from './auths.service';
import { LoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const result = await this.authsService.login(loginDto);
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('accessToken', result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(HttpStatus.OK).json(result);
  }
}
