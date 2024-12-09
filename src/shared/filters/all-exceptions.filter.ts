import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface IException {
  response: { message: string };
  message: string;
}

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({
      message: this.formatData(exception as unknown as IException),
      data: null,
    });
  }

  formatData(exception: IException): string {
    if (exception.response?.message) {
      return exception.response.message;
    }

    return exception.message;
  }
}
