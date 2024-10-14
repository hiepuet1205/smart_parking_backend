import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '@shared/interfaces/token-payload.interface';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UserServiceGrpc } from '@shared/grpc/services';
import { FileService } from '@shared/services/file.service';

@Injectable()
export class AuthsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userServiceGrpc: UserServiceGrpc,
    private readonly fileService: FileService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = (await this.userServiceGrpc.getUserByEmail({ email: loginDto.email })).user;

    if (!user) throw new BadRequestException('Email not found');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) throw new BadRequestException('Password not match');

    const accessToken = this.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return {
      status: 'success',
      message: 'Login successfully',
      data: { accessToken, refreshToken },
    };
  }

  private generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  private generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }
}
