import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Enable2FAType } from 'src/types/auth-types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("auth")
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}
  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
  status: 201,
  description: 'It will return the user in the response',
  })
  signup(
    @Body()
    userDTO: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(userDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
  @Req() req: ExpressRequest
  ) {
    return this.authService.login(req.user);
  }

  @Post('login2')
  login2(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login2(loginDTO);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Req() req: ExpressRequest,
  ): Promise<Enable2FAType> {
    console.log(req.user, 'User Data 2FA');
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.enable2FA((req.user as any).userId);
  }

  @Post('validate-2fa')
  validate2FA(
    @Body()
    ValidateTokenDTO: ValidateTokenDTO,
  ) {
    return this.authService.validate2FAToken(
      ValidateTokenDTO.userId,
      ValidateTokenDTO.token,
    );
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Req() req: ExpressRequest,
  ): Promise<UpdateResult> {
  return this.authService.disable2FA((req.user as any).userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Req() req: ExpressRequest,
  ) {
    delete (req.user as any).password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
