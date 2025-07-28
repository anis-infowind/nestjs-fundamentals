import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

type MyResponseObj = {
  statusCode: number,
  timestamp: string,
  path: string,
  response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly logger: MyLoggerService
  )
    {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException){
      myResponseObj.statusCode = exception.getStatus()
      myResponseObj.response = exception.getResponse()
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      myResponseObj.response = 'Internal Server Error'
    }

    response 
      .status(myResponseObj.statusCode) 
      .json(myResponseObj)

    this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

    super.catch(exception, host);
  }
}