import { Module } from '@nestjs/common';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';

@Module({
  providers: [JwtAccessTokenStrategy],
})
export class WebInitModule {}
