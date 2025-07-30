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
    const type = host.getType();
    
    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: '',
      response: '',
    };

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      myResponseObj.path = request?.url || '';

      if (exception instanceof HttpException){
        myResponseObj.statusCode = exception.getStatus()
        myResponseObj.response = exception.getResponse()
      } else {
        myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        myResponseObj.response = 'Internal Server Error'
      }
  
      response 
        .status(myResponseObj.statusCode) 
        .json(myResponseObj);
    } else {
      // Handle non-HTTP requests (GraphQL, WebSocket, etc.)
      if (exception instanceof HttpException) {
        myResponseObj.statusCode = exception.getStatus();
        myResponseObj.response = exception.getResponse();
      } else {
        myResponseObj.response = 'Internal Server Error';
      }
      
      // For non-HTTP requests, we don't call super.catch as it expects HTTP context
      this.logger.error(myResponseObj.response, AllExceptionsFilter.name);
      return;
    }

    this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

    super.catch(exception, host);
  }
}