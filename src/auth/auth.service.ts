import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/types/payload.type';
import { Enable2FAType } from 'src/types/auth-types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService
  ) {}
  async login2(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDTO); // 1.
    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password); // 2.
    if (passwordMatched) {
    // 3.
    const { password, ...userWithoutPassword } = user; // 5.
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
    } else {
      throw new UnauthorizedException("Password does not match"); // 5.
    }
  }

  async login(user: any): Promise<{ access_token: string } | { validate2FA: string; message: string }> {
    const payload: PayloadType = { email: user.email, sub: user.id };
    const artist = await this.artistService.findArtist(user.id);
    if (artist) {
      payload.artistId = artist.id;
    }

    if (user.enable2FA && user.twoFASecret) {
      //1.
      // sends the validateToken request link
      // else otherwise sends the json web token in the response
      return {
        //2.
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        message:
          'Please sends the one time password/token from your Google Authenticator App',
      };
    }
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password); // compare hashed
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async enable2FA(userId: number) : Promise<Enable2FAType> {
    const user = await this.userService.findById(userId); //1
    if (user.enable2FA) { //2
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret(); //3
    console.log(secret);
    user.twoFASecret = secret.base32; //4
    await this.userService.updateSecretKey(user.id, user.twoFASecret); //5
    return { secret: user.twoFASecret }; //6
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);

      // extract his 2FA secret

      // verify the secret with token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

}
