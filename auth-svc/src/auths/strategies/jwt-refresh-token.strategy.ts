// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UserRepository } from '@shared/repository/user.repository';
// import { TokenPayload } from '@shared/interfaces/token-payload.interface';
// import { Request } from 'express';

// @Injectable()
// export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userRepository: UserRepository,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           const data = request?.cookies?.refreshToken;

//           if (!data) {
//             throw new UnauthorizedException();
//           }

//           return data;
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
//     });
//   }

//   async validate(payload: TokenPayload) {
//     return await this.userRepository.findOne({ where: { id: payload.userId }, relations: ['location'] });
//   }
// }
