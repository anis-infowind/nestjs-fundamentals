import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as PassportJwt } from "passport-jwt";
import { authConstants } from "../auth.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwt) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConstants.secret,
      ignoreExpiration: false // Rejects the token if it's expired
    });
  }

  async validate(payload: any) {
    console.log(payload, 'payload');
    return { userId: payload.sub, email: payload.email };
  }
}