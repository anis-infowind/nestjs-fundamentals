import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../../types/payload.type";

@Injectable()
export class JwtArtistGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Inside JwtArtistGuard');
    return super.canActivate(context);
  }

  handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(user, 'JwtArtistGuard -> handleRequest()');
    if (user.artistId) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}