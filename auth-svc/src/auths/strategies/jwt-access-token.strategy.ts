// import { UserRepository } from '../../shared/repository/user.repository';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { TokenPayload } from '@shared/interfaces/token-payload.interface';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request } from 'express';

// @Injectable()
// export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userRepository: UserRepository,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           const data = request?.cookies?.accessToken;

//           if (!data) {
//             throw new UnauthorizedException();
//           }

//           return data;
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
//     });
//   }

//   async validate(payload: TokenPayload) {
//     return await this.userRepository.findOne({ where: { id: payload.userId }, relations: ['location'] });
//   }
// }
