import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as PassportJwt } from "passport-jwt";
import { authConstants } from "../auth.constants";
import { PayloadType } from "../../types/payload.type";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwt) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret') || 'defaultSecret',
      ignoreExpiration: false // Rejects the token if it's expired
    });
  }

  async validate(payload: PayloadType) {
    console.log(payload, 'jwt payload');
    return {
      userId: payload.sub,
      email: payload.email,
      artistId: payload.artistId, // 2
    };
  }
}