import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}
  @Post('signup')
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
}
