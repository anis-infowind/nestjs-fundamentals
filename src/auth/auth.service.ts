import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/types/payload.type';
import { Enable2FAType } from 'src/types/auth-types';
import * as speakeasy from 'speakeasy';
import { ArtistDocument } from 'src/artists/schemas/artist.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService
  ) {}
  async login2(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDTO) as UserDocument; // 1.

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password); // 2.
    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(user: any): Promise<{ access_token: string } | { userId: string, message: string }> {
    const payload: PayloadType = { email: user.email, sub: user._id };
    const artist = await this.artistService.findArtist(user._id) as ArtistDocument;
    if (artist) {
      payload.artistId = artist._id.toString();
    }

    if (user.enable2FA && user.twoFASecret) {
      //1.
      // sends the validateToken request link
      // else otherwise sends the json web token in the response
      return {
        //2.
        userId: user._id,
        message: 'Please sends the one time password/token from your Google Authenticator App',
      };
    }

    return await this.generateAccessToken(user);
  }

  async generateAccessToken(user: any): Promise<{ access_token: string }> {
    const payload: PayloadType = { email: user.email, sub: user._id };
    const artist = await this.artistService.findArtist(user._id) as ArtistDocument;
    if (artist) {
      payload.artistId = artist._id.toString();
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password); // compare hashed
    if (!isMatch) return null;
    return user;
  }

  async enable2FA(userId: string) : Promise<Enable2FAType> {
    const user = await this.userService.findById(userId) as UserDocument; //1

    if (user.enable2FA) { //2
      return { secret: user.twoFASecret ?? '' };
    }
    const secret = speakeasy.generateSecret(); //3
    console.log(secret);
    if(!user.twoFASecret) {
      user.twoFASecret = secret.base32; //4
    }
    await this.userService.updateSecretKey(user._id.toString(), user.twoFASecret); //5
    return { secret: user.twoFASecret }; //6
  }

  async validate2FAToken(
    userId: string,
    token: string,
  ): Promise<{ verified: boolean; access_token?: string; message?: string; }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // extract his 2FA secret

      // verify the secret with token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret ?? '',
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        const accessToken = await this.generateAccessToken(user);
        return {
          verified: true,
          access_token: accessToken.access_token
        };
      } else {
        return {
          verified: false,
          message: 'Code is expired',
        };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(userId: string): Promise<UserDocument | null> {
    const user = await this.userService.disable2FA(userId);
    return user?.toObject() as UserDocument;
  }

  async myDetails(userId: string): Promise<UserDocument | null> {
    const user = await this.userService.findById(userId);
    return user?.toObject() as UserDocument;
  }

  async validateUserByApiKey(apiKey: string): Promise<UserDocument | null> {
    const user = await this.userService.findByApiKey(apiKey);
    return user?.toObject() as UserDocument;
  }

}
