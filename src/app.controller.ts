import { Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';

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
    console.log(req)
    return req.user;
  }

  @Get('test')
  testEnv() {
    return this.appService.getEnvVariables();
  }

  //File upload
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(file);
    return {
      message: 'File uploaded successfully',
      file,
    };
  }

  // only want to accept png file
  @Post('upload-png')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadPngFile(
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     //new MaxFileSizeValidator({ maxSize: 1000 }),
      //     new FileTypeValidator({ fileType: 'image/png' }),
      //   ],
      // }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/png',
        })
        // .addMaxSizeValidator({
        //   maxSize: 70706,
        // })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      message: 'file uploaded successfully!',
    };
  }

  @Get('set-cookie')
  setCookie(
    @Res({ passthrough: true })
    response: Response,
  ) {
    response.cookie('nestjs-cookie', 'encrypted cookie string');
    response.send('Cookie Saved Successfully');
  }
  @Get('get-cookie')
  finndAll(@Req() req: Request) {
    console.log(req.cookies);
    return req.cookies;
  }
}
