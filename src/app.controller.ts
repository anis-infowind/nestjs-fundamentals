import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Req() req: ExpressRequest,
  ) {
    return req.user;
  }

  @Get('test')
  testEnv() {
    return this.appService.getEnvVariables();
  }
}
