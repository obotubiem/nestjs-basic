import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ValidationPipeException } from './validation-pipe.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    this.logger.error(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof ValidationPipeException
        ? exception.message
        : exception instanceof Prisma.PrismaClientValidationError
        ? exception.message
        : 'Unknown Error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      message = `${exception.message} (${exception.code})`;
      switch (exception.code) {
        case 'P2025':
          httpStatus = HttpStatus.NOT_FOUND;
          break;

        default:
          break;
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (exception instanceof ValidationPipeException) {
      responseBody.data = exception.getValidationErrors();
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
