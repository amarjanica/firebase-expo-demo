import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { EmailSendFailedError } from './mailgun/errors';
import { RecaptchaException } from './recaptcha/errors';

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();
      return response.status(status).json(typeof responseBody === 'string' ? { message: responseBody } : responseBody);
    }

    this.logger.error(exception);

    if (exception instanceof EmailSendFailedError) {
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        message: exception.message,
      });
    }

    if (exception instanceof RecaptchaException) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: exception.message,
      });
    }

    if (exception instanceof Error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
}
