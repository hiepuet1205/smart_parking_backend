import { Module } from '@nestjs/common';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { UserRepository } from '@shared/repository/user.repository';

@Module({
  providers: [JwtAccessTokenStrategy, UserRepository],
})
export class WebInitModule {}
